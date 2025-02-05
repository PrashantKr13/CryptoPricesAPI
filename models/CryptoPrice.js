const mongoose = require('mongoose');

const cryptoPriceSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  name: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  change24h: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CryptoPrice', cryptoPriceSchema);