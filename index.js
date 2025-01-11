require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const fetchCryptoData = require('./jobs/fetchCryptoData');
const statsRoute = require('./routes/stats');
const deviationRoute = require('./routes/deviation');

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// Schedule the job to run every 2 hours
cron.schedule('0 */2 * * *', () => {
  console.log('Running the crypto data fetch job...');
  fetchCryptoData();
});

// Use the /stats route
app.use('/', statsRoute);
// Use the /deviation route
app.use('/', deviationRoute);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));