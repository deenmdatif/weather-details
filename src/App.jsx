
import './App.css';

import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const unsplashApiKey = import.meta.env.VITE_UNSPLASH_API_KEY;
  const openWeatherMapApiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  useEffect(() => {
    fetchRandomBackground();
  }, []);

  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error('Failed to preload image'));
    });
  };

  const fetchRandomBackground = async () => {
    const apiUrl = `https://api.unsplash.com/photos/random?client_id=${unsplashApiKey}&query=nature&orientation=landscape`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        const imageUrl = data.urls.full;
        await preloadImage(imageUrl);
        document.body.style.backgroundImage = url(${imageUrl});
        const attributionHtml = `Photo by <a href="https://unsplash.com/@${data.user.username}?utm_source=weather_app_2&utm_medium=referral" target="_blank" style="color:#0366d6;font-weight:bold;">${data.user.name}</a>
          on <a href="https://unsplash.com/?utm_source=weather_app_2&utm_medium=referral" target="_blank" style="color:#0366d6;font-weight:bold;">Unsplash</a>`;
        document.getElementById('attribution').innerHTML = attributionHtml;
      } else {
        console.error('Error fetching background image:', data);
      }
    } catch (error) {
      console.error('Error fetching background image:', error);
    }
  };

  const getBackgroundImage = async (city) => {
    const unsplashApiUrl = `https://api.unsplash.com/photos/random?query=nature,${city}&orientation=landscape&exclude=people&client_id=${unsplashApiKey}`;

    try {
      const response = await fetch(unsplashApiUrl);
      const data = await response.json();

      if (response.ok && data.urls && data.urls.full) {
        const imageUrl = data.urls.full;
        await preloadImage(imageUrl);
        document.body.style.backgroundImage = url(${imageUrl});
        const attributionHtml = `Photo by <a href="https://unsplash.com/@${data.user.username}?utm_source=weather_app_2&utm_medium=referral" target="_blank" style="color:#0366d6;font-weight:bold;">${data.user.name}</a>
          on <a href="https://unsplash.com/?utm_source=weather_app_2&utm_medium=referral" target="_blank" style="color:#0366d6;font-weight:bold;">Unsplash</a>`;
        document.getElementById('attribution').innerHTML = attributionHtml;
      } else {
        console.error('Error fetching background image:', data.errors);
      }
    } catch (error) {
      console.error('Error fetching background image:', error);
    }
  };

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
        getBackgroundImage(city);
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

  const openMap = (selectedLayer) => {
    setLayer(selectedLayer);
    setIsMapOpen(true);
  };

  const closeMap = () => {
    setIsMapOpen(false);
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
            {weather && (
              <div className="map-icons">
                <FaCloud title="Clouds" onClick={() => openMap('clouds_new')} />
                <FaTint title="Precipitation" onClick={() => openMap('precipitation_new')} />
                <FaMapMarkerAlt title="Pressure" onClick={() => openMap('pressure_new')} />
                <FaWind title="Wind" onClick={() => openMap('wind_new')} />
                <FaTemperatureHigh title="Temperature" onClick={() => openMap('temp_new')} />
              </div>
            )}
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
        <button className="change-bg-btn" onClick={fetchRandomBackground}>
          <div className="gg-arrows-exchange"></div>
        </button>
      </div>
      <div id="attribution" className="attribution"></div>
    </div>
  );
}

export default App;
