
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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
  createdAt: { type: Date, default: Date.now }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// Routes
app.post('/collect', async (req, res) => {
  try {
    const analyticsData = new Analytics(req.body);
    await analyticsData.save();
    res.status(201).json({ message: 'Analytics data saved successfully' });
  } catch (error) {
    console.error('Error saving analytics:', error);
    res.status(500).json({ error: 'Failed to save analytics data' });
  }
});

// Get analytics data (protected route example)
app.get('/analytics', async (req, res) => {
  try {
    const data = await Analytics.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 