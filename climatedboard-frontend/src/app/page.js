"use client"; // Make this a Client Component

import React, { useState, useEffect } from 'react';

const WeatherPage = () => {
  const city = 'London'; // Hardcoded city, we can change it to any city
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch weather data when the component mounts
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (city) => {
    try {
      const res = await fetch(`http://localhost:5000/api/weather/${city}`);
      if (!res.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Weather Information</h1>

      {error ? (
        <div>Error: {error}</div>
      ) : !weatherData ? (
        <div>Loading...</div>
      ) : (
        <table border="1" style={{ marginTop: '20px', width: '50%' }}>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>City</td>
              <td>{weatherData.name}</td>
            </tr>
            <tr>
              <td>Temperature</td>
              <td>{weatherData.main.temp}°C</td>
            </tr>
            <tr>
              <td>Feels Like</td>
              <td>{weatherData.main.feels_like}°C</td>
            </tr>
            <tr>
              <td>Humidity</td>
              <td>{weatherData.main.humidity}%</td>
            </tr>
            <tr>
              <td>Weather</td>
              <td>{weatherData.weather[0].description}</td>
            </tr>
            <tr>
              <td>Wind Speed</td>
              <td>{weatherData.wind.speed} m/s</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WeatherPage;
