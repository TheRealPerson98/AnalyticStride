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
  eventType: { type: String, default: 'pageview' }, // pageview or button_click
  buttonName: String, // For button clicks
  buttonText: String, // For button clicks
  createdAt: { type: Date, default: Date.now }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.post('/collect', async (req, res) => {
  try {
    const analyticsData = new Analytics(req.body);
    await analyticsData.save();
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

    // Filter by event type if specified
    if (eventType) {
      query.eventType = eventType;
    }

    // Filter by date range if specified
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
    res.status(500).json({ status: 'error', message: 'Failed to fetch analytics data' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 