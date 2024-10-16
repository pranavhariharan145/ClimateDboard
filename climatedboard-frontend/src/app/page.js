"use client"; // Mark this as a Client Component

import React, { useState } from 'react';

const WeatherPage = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeatherData(city);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Search Weather Information</h1>

      <form onSubmit={handleSubmit} className="flex flex-col text-white items-center mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          required
          className="bg-gray-600 bg-opacity-50 border-2 border-none rounded-md px-4 py-2 focus:outline-none"
        />


        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2"
        >
          Search
        </button>
      </form>

      {error && <div className="text-red-500">{error}</div>}

      {loading ? (
        <div>Loading weather data...</div>
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
        <div>Enter a city to see the weather data</div>
      )}
    </div>
  );
};

export default WeatherPage;
