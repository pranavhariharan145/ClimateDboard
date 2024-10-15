import React, { useState } from 'react';

export async function getServerSideProps(context) {
  const city = context.query.city || 'London'; // Default to London if no city is provided
  let weatherData = null;
  let error = null;

  try {
    const res = await fetch(`http://localhost:5000/api/weather/${city}`);
    if (!res.ok) {
      throw new Error('Failed to fetch weather data');
    }
    weatherData = await res.json();
  } catch (err) {
    error = err.message;
  }

  return {
    props: { weatherData, error, city }, // Pass the data or error as props
  };
}

const WeatherPage = ({ weatherData, error, city }) => {
  const [searchCity, setSearchCity] = useState(city);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/?city=${searchCity}`; // Redirect with the city query parameter
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Weather Information for {weatherData.name}</h1>
      <p>Temperature: {weatherData.main.temp}°C</p>
      <p>Weather: {weatherData.weather[0].description}</p>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default WeatherPage;
