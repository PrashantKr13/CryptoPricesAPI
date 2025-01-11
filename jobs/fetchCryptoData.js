const axios = require('axios');
const CryptoPrice = require('../models/CryptoPrice');

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';
const COINS = ['bitcoin', 'matic-network', 'ethereum'];

async function fetchCryptoData() {
  try {
    // Fetch data from CoinGecko API
    const response = await axios.get(COINGECKO_URL, {
      params: {
        ids: COINS.join(','),
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true,
      },
    });

    const data = response.data;
    // Save data to the database
    for (const coinId of COINS) {
      const coinData = data[coinId];

      const newEntry = new CryptoPrice({
        coinId,
        name: coinId.replace('-', ' ').toUpperCase(),
        currentPrice: coinData.usd,
        marketCap: coinData.usd_market_cap,
        change24h: coinData.usd_24h_change,
      });

      await newEntry.save();
    }

    console.log('Crypto data successfully fetched and stored.');
  } catch (error) {
    console.error('Error fetching crypto data:', error.message);
  }
}

module.exports = fetchCryptoData;