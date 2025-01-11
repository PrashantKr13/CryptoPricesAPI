const express = require('express');
const CryptoPrice = require('../models/CryptoPrice');

const router = express.Router();

/**
 * Calculate the standard deviation
 * @param {Array<number>} prices - List of prices
 * @returns {number} Standard deviation
 */
function calculateStandardDeviation(prices) {
  const n = prices.length;

  if (n === 0) return 0;

  const mean = prices.reduce((sum, price) => sum + price, 0) / n;

  const variance =
    prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / n;

  return Math.sqrt(variance);
}

// Define the /deviation endpoint
router.get('/deviation', async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: 'Missing query parameter: coin' });
  }

  try {
    // Fetch the last 100 records for the requested cryptocurrency
    const records = await CryptoPrice.find({ coinId: coin })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(100)
      .exec();

    if (!records || records.length === 0) {
      return res.status(404).json({ error: 'No data found for the requested cryptocurrency' });
    }

    // Extract prices from the records
    const prices = records.map((record) => record.currentPrice);

    // Calculate the standard deviation
    const deviation = calculateStandardDeviation(prices);

    // Respond with the deviation
    return res.json({ deviation: deviation.toFixed(5) });
  } catch (error) {
    console.error('Error calculating deviation:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;