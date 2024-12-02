const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'X-API-Key'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/analyticstride', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  pathname: String,
  timestamp: Number,
  referrer: String,
  userAgent: String,
  screenResolution: String,
  language: String,
  hostname: String,
  eventType: { type: String, default: 'pageview' },
  buttonName: String,
  buttonText: String,
  createdAt: { type: Date, default: Date.now }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers
  });
  next();
});

// Routes
app.post('/collect', async (req, res) => {
  try {
    console.log('Received analytics data:', req.body);
    
    const analyticsData = new Analytics(req.body);
    console.log('Created analytics document:', analyticsData);
    
    await analyticsData.save();
    console.log('Saved analytics document successfully');
    
    res.status(201).json({ status: 'success' });
  } catch (error) {
    console.error('Error saving analytics:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save analytics data' });
  }
});

// Get analytics data with filtering
app.get('/analytics', async (req, res) => {
  try {
    const { eventType, from, to } = req.query;
    let query = {};

    if (eventType) {
      query.eventType = eventType;
    }

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = parseInt(from);
      if (to) query.timestamp.$lte = parseInt(to);
    }

    const data = await Analytics.find(query).sort({ createdAt: -1 });
    res.json({ 
      status: 'success', 
      data,
      summary: {
        total: data.length,
        pageviews: data.filter(d => d.eventType === 'pageview').length,
        buttonClicks: data.filter(d => d.eventType === 'button_click').length
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch analytics data' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ status: 'error', message: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 