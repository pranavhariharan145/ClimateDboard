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
// Fetch weather information for a given city (from URL)
// Fetch weather information for a given city (from URL)
app.get('/api/weather/:city', async (req, res) => {
    const apiKey = process.env.OPENWEATHER_API_KEY; // Get the API key from environment variables
    const city = req.params.city; // Get the city name from the URL
  
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // API URL with dynamic city
  
    try {
      const fetch = (await import('node-fetch')).default; // Use dynamic import
      const response = await fetch(apiUrl); // Fetch the weather data
  
      if (!response.ok) {
        // Log the response status and status text
        console.error('Response Status:', response.status, response.statusText);
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
