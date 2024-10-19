"use client"
import React, { useState, useEffect } from 'react';

const WeatherPage = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState([]); // State to hold news articles
  const [expandedArticleIndex, setExpandedArticleIndex] = useState(null); // State to track the expanded article

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

  // Function to fetch news data
  const fetchNewsData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/news');
      if (!res.ok) {
        throw new Error('Failed to fetch news data');
      }
      const news = await res.json();
      setNewsData(news);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch news data when the component mounts
  useEffect(() => {
    fetchNewsData();
  }, []);

  // Handle form submission (trigger fetch when Enter is pressed)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeatherData(city);
      setError(null); // Clear any previous errors
    }
  };

  // Toggle expand/collapse of the article
  const toggleArticle = (index) => {
    setExpandedArticleIndex(expandedArticleIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-row items-start justify-center pt-10">
      {/* Weather Section */}
      <div className="flex-grow flex flex-col items-center mb-6 w-1/2 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col items-center mb-6 w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter a City"
              required
              className="bg-gray-600 bg-opacity-50 border-2 border-transparent rounded-md px-5 py-0.5 w-full focus:outline-none focus:border-blue-500 text-lg placeholder-gray-400"
            />
            {/* SVG Find (Search) Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
          <table className="table-auto border-collapse border border-white mt-4 w-full rounded-lg bg-gray-900 overflow-hidden">
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

      {/* News section */}
      {/* News section */}
      <div className="w-1/2 h-[90vh] bg-gray-700 overflow-y-scroll rounded-lg p-4">
        <h2 className="text-white text-lg font-semibold mb-4">Climate News</h2>
        {newsData.length > 0 ? (
          newsData.map((article, index) => (
            <div key={index} className="mb-4 p-2 bg-gray-600 rounded flex flex-col">
              <h3 className="text-white font-bold">{article.title}</h3>
              <p className="text-gray-300 text-sm">{article.description}</p>

              {expandedArticleIndex === index ? (
                <div className="mt-2 text-gray-300 text-sm">
                  <p>{article.content ? article.content : 'Content not available.'}</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior
                      toggleArticle(index); // Collapse the article
                    }}
                    className="text-blue-400 text-sm cursor-pointer mt-2"
                  >
                    Read less
                  </a>
                </div>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    toggleArticle(index); // Expand the article
                  }}
                  className="text-blue-400 text-sm cursor-pointer"
                >
                  Read more
                </a>
              )}

              {/* Always visible Visit full article button */}
              {article.url && (
                <a
                  href={article.url}
                  target="_blank" // Open in new tab
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm cursor-pointer mt-2"
                >
                  Visit full article
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-400">No news available</div>
        )}
      </div>


    </div>
  );
};

export default WeatherPage;
