const express = require('express');
const CryptoPrice = require('../models/CryptoPrice');

const router = express.Router();

// Define the /stats endpoint
router.get('/stats', async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: 'Missing query parameter: coin' });
  }

  try {
    // Find the latest data for the requested cryptocurrency
    const latestData = await CryptoPrice.findOne({ coinId: coin })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .exec();

    if (!latestData) {
      return res.status(404).json({ error: 'Cryptocurrency data not found' });
    }

    // Respond with the latest data
    return res.json({
      price: latestData.currentPrice,
      marketCap: latestData.marketCap,
      "24hChange": latestData.change24h,
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;