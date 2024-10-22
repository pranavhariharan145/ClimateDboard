"use client";
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables
const axios = require('axios');
const moment = require('moment-timezone'); // Import moment-timezone

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev')); // Logging middleware
app.use(bodyParser.json()); // Body parser for JSON requests
app.use(cors());

// Fetch weather information for given coordinates (latitude & longitude)
app.get('/api/weather', async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error('Response Status:', response.status, response.statusText);
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await response.json();
    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
});

// Fetch weather information for a given city (from URL)
app.get('/api/weather/:city', async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const city = req.params.city;

  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error('Response Status:', response.status, response.statusText);
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await response.json();
    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
});

// Fetch climate-related news articles
app.get('/api/news', async (req, res) => {
  const newsApiKey = process.env.NEWS_API_KEY;
  const query = req.query.q || 'weather report'; // Adjust query based on input

  const apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsApiKey}&language=en&sortBy=publishedAt&pageSize=30`;

  try {
    const response = await axios.get(apiUrl);
    const newsData = response.data.articles;

    res.status(200).json(newsData);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

// Fetch current time for a given city (World Clock)
app.get('/api/time/:city', (req, res) => {
  const city = req.params.city;

  try {
    // Use moment-timezone to get the current time for the given city
    const timezone = moment.tz.guess(city); // Guess the timezone based on the city
    if (!timezone) {
      return res.status(400).json({ message: 'Invalid city or time zone not found' });
    }

    // Format to include day of the week, date, and time
    const currentTime = moment().tz(timezone).format('dddd, YYYY-MM-DD HH:mm:ss'); // Example: "Monday, 2024-10-20 15:30:00"
    
    res.status(200).json({ city, currentTime });
  } catch (error) {
    console.error('Error fetching time:', error);
    res.status(500).json({ message: 'Error fetching time', error: error.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
