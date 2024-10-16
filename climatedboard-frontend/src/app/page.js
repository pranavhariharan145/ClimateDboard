"use client"; // Mark this as a Client Component

import React, { useState } from 'react';

const WeatherPage = () => {
  const [city, setCity] = useState(''); // State to store the user input city
  const [weatherData, setWeatherData] = useState(null); // State to store fetched weather data
  const [error, setError] = useState(null); // State to store error message

  // Function to fetch weather data for the input city
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (city) {
      fetchWeatherData(city); // Fetch weather data for the entered city
      setError(null); // Clear any previous errors
    }
  };

  return (
    <div>
      <h1>Search Weather Information</h1>
      
      {/* Search form to input city */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter city name" 
          required 
        />
        <button type="submit">Search</button>
      </form>

      {/* Error handling */}
      {error && <div>Error: {error}</div>}
      
      {/* Loading or weather data display */}
      {weatherData ? (
        <table
          style={{
            marginTop: '20px',
            width: '50%',
            borderCollapse: 'collapse', 
            border: '2px solid white' // White border for the table
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid white', padding: '8px' }}>Attribute</th>
              <th style={{ border: '1px solid white', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid white', padding: '8px' }}>City</td>
              <td style={{ border: '1px solid white', padding: '8px' }}>{weatherData.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid white', padding: '8px' }}>Temperature</td>
              <td style={{ border: '1px solid white', padding: '8px' }}>{weatherData.main.temp}°C</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid white', padding: '8px' }}>Feels Like</td>
              <td style={{ border: '1px solid white', padding: '8px' }}>{weatherData.main.feels_like}°C</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid white', padding: '8px' }}>Humidity</td>
              <td style={{ border: '1px solid white', padding: '8px' }}>{weatherData.main.humidity}%</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid white', padding: '8px' }}>Weather</td>
              <td style={{ border: '1px solid white', padding: '8px' }}>{weatherData.weather[0].description}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid white', padding: '8px' }}>Wind Speed</td>
              <td style={{ border: '1px solid white', padding: '8px' }}>{weatherData.wind.speed} m/s</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div>Enter a city to see the weather data</div>
      )}
    </div>
  );
};

export default WeatherPage;
