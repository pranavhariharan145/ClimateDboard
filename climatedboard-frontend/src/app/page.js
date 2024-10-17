"use client"; // Mark this as a Client Component

import React, { useState } from 'react';

const WeatherPage = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch weather data for the input city
  const fetchWeatherData = async (city) => {
    setLoading(true);
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
    setLoading(false);
  };

  // Handle form submission (trigger fetch when Enter is pressed)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeatherData(city);
      setError(null); // Clear any previous errors
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-start pt-10">
      
      {/* Search box with a find logo (SVG inside the input field) */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-6">
        <div className="relative w-[32rem]">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            required
            className="bg-gray-600 bg-opacity-50 border-2 border-none rounded-md px-4 py-1 w-full focus:outline-none focus:border-blue-500 text-lg"
          />
          
          {/* SVG Find (Search) Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15A7.5 7.5 0 1112 4.5a7.5 7.5 0 016.5 6.5z" />
          </svg>
        </div>
      </form>

      {/* Error handling */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Loading or weather data */}
      {loading ? (
        <div className="text-white">Loading weather data...</div>
      ) : weatherData ? (
        <table className="table-auto border-collapse border border-white mt-4 w-1/2 rounded-lg bg-gray-900 overflow-hidden">
          <thead>
            <tr>
              <th className="border border-white px-4 py-2">Attribute</th>
              <th className="border border-white px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-white px-4 py-2">City</td>
              <td className="border border-white px-4 py-2">{weatherData.name}</td>
            </tr>
            <tr>
              <td className="border border-white px-4 py-2">Temperature</td>
              <td className="border border-white px-4 py-2">{weatherData.main.temp}°C</td>
            </tr>
            <tr>
              <td className="border border-white px-4 py-2">Feels Like</td>
              <td className="border border-white px-4 py-2">{weatherData.main.feels_like}°C</td>
            </tr>
            <tr>
              <td className="border border-white px-4 py-2">Humidity</td>
              <td className="border border-white px-4 py-2">{weatherData.main.humidity}%</td>
            </tr>
            <tr>
              <td className="border border-white px-4 py-2">Weather</td>
              <td className="border border-white px-4 py-2">{weatherData.weather[0].description}</td>
            </tr>
            <tr>
              <td className="border border-white px-4 py-2">Wind Speed</td>
              <td className="border border-white px-4 py-2">{weatherData.wind.speed} m/s</td>
            </tr>
          </tbody>
        </table>

      ) : (
        <div></div>
      )}
    </div>
  );
};

export default WeatherPage;
