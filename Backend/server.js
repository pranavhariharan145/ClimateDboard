// server.js
"use client";
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables
const axios = require('axios'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev')); // Logging middleware
app.use(bodyParser.json()); // Body parser for JSON requests
app.use(cors());

// Fetch weather information for given coordinates (latitude & longitude)
app.get('/api/weather', async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY; // Get the OpenWeather API key from environment variables
  const { lat, lon } = req.query; // Extract latitude and longitude from the query parameters

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required' }); // Error if lat or lon are missing
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; // OpenWeather API URL for coordinates

  try {
    const fetch = (await import('node-fetch')).default; // Use dynamic import for node-fetch
    const response = await fetch(apiUrl); // Fetch the weather data using coordinates

    if (!response.ok) {
      console.error('Response Status:', response.status, response.statusText);
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await response.json(); // Parse the JSON response
    res.status(200).json(weatherData); // Send the weather data as JSON
  } catch (error) {
    console.error('Error fetching weather data:', error); // Log any error
    res.status(500).json({ message: 'Error fetching weather data', error: error.message }); // Send error response
  }
});


// Fetch weather information for a given city (from URL)
app.get('/api/weather/:city', async (req, res) => {
    const apiKey = process.env.OPENWEATHER_API_KEY; // Get the API key from environment variables
    const city = req.params.city; // Get the city name from the URL
  
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // API URL with dynamic city
  
    try {
      const fetch = (await import('node-fetch')).default; // Use dynamic import
      const response = await fetch(apiUrl); // Fetch the weather data
  
      if (!response.ok) {
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

// Fetch climate-related news articles
app.get('/api/news', async (req, res) => {
  const newsApiKey = process.env.NEWS_API_KEY; // Fetch News API key from .env
  const query = 'weather report'; // climate-related query

  const apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsApiKey}&language=en&sortBy=publishedAt&pageSize=30`;

  try {
      const response = await axios.get(apiUrl); // Use axios to fetch data from the News API
      const newsData = response.data.articles; // Extract articles from the response

      res.status(200).json(newsData); // Send the articles as JSON
  } catch (error) {
      console.error('Error fetching news:', error); // Log the error
      res.status(500).json({ message: 'Error fetching news', error: error.message }); // Send error response
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
