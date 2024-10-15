// server.js
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev')); // Logging middleware
app.use(bodyParser.json()); // Body parser for JSON requests

// GET Meathod to fetch london
app.get('/api/weather', async (req, res) => {
  const apiKey = "74e35b620f15ff2f077b03d6d15bebba"; // Get the API key from environment variables
  const city = 'Chennai'; // Hardcoded city name for London

  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // URL for OpenWeatherMap API

  try {
    const fetch = (await import('node-fetch')).default; // Use dynamic import
    const response = await fetch(apiUrl); // Fetch the weather data
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const weatherData = await response.json(); // Parse the JSON response
    res.status(200).json(weatherData); // Send the weather data as JSON
  } catch (error) {
    console.error('Error fetching weather data:', error); // Log the error
    res.status(500).json({ message: 'Error fetching weather data', error: error.message }); // Send error response
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
