import './App.css';

import { FaCloud, FaMapMarkerAlt, FaTemperatureHigh, FaTint, FaWind } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import WeatherMap from './WeatherMap';

Modal.setAppElement('#root');

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const openWeatherMapApiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;


  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleGetWeather = async () => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        setError(null);
      } else {
        setError(data.message);
        setWeather(null);
      }
    } catch (error) {
      setError('An error occurred while fetching weather data.');
      setWeather(null);
    }
  };

  const handleRetry = () => {
    setError(null);
    setCity('');
  };


  return (
    <div className="overlay">
      <div className="app">
        {error ? (
          <div className="error-page">
            <h1>Error: {error}</h1>
            <button onClick={handleRetry}>Go Back</button>
          </div>
        ) : (
          <div className="container">
            <div className="weather-content">
              <h1>Weather App</h1>
              <input
                type="text"
                value={city}
                onChange={handleInputChange}
                placeholder="Enter city name"
              />
              <button onClick={handleGetWeather}>Get Weather</button>
              {weather && (
                <div className="weather-info">
                  <h2>Weather in {weather.name}</h2>
                  <div className="weather-grid">
                    <div className="weather-details">
                      <p>Temperature: {weather.main.temp}°C</p>
                      <p>Weather: {weather.weather[0].description}</p>
                      <p>Humidity: {weather.main.humidity}%</p>
                      <p>Wind Speed: {weather.wind.speed} m/s</p>
                    </div>
                    <div className="weather-icon">
                      <img
                        src={https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png}
                        alt={weather.weather[0].description}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;
