import React, { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import Header from './components/Header';
import WeatherHero from './components/WeatherHero';
import WeatherMap from './components/WeatherMap';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherDetails from './components/WeatherDetails';
import SunriseSunset from './components/SunriseSunset';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import AmbientWeatherEffects from './components/AmbientWeatherEffects';
import './App.css';

function App() {
  const {
    location,
    weatherData,
    loading,
    error,
    isLocating,
    locationError,
    setCoordinates,
    searchLocation,
    useCurrentLocation,
    clearLocationError,
    clearError,
    refreshWeather
  } = useWeather();

  const [unit, setUnit] = useState('C');

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleSelectLocation = (lat, lng) => {
    setCoordinates(lat, lng);
  };

  const handleSearchQuery = async (queryText) => {
    await searchLocation(queryText);
  };

  // Initial full loading skeleton before weatherData arrives
  if (loading && !weatherData) {
    return (
      <div className="app-wrapper">
        <LoadingState />
      </div>
    );
  }

  // Full-screen error if initial fetch fails without existing data
  if (error && !weatherData) {
    return (
      <div className="app-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <ErrorState message={error} onRetry={refreshWeather} />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Background Ambient Effects Layer */}
      <AmbientWeatherEffects weather={weatherData} />

      <div className="dashboard-container">
        {/* Navigation Header */}
        <Header 
          onSelectLocation={handleSelectLocation}
          onSearchQuery={handleSearchQuery}
          unit={unit}
          onToggleUnit={toggleUnit}
          onUseCurrentLocation={useCurrentLocation}
          isLocating={isLocating}
        />

        {/* Location or Search Alert Banners */}
        {(error || locationError) && (
          <div 
            className="glass-panel alert-banner"
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              background: 'rgba(239, 68, 68, 0.15)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: 'var(--text-primary)',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '500' }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span>{locationError || error}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (locationError) clearLocationError();
                if (error) clearError();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'var(--text-primary)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. HERO WEATHER */}
        <WeatherHero 
          weather={weatherData} 
          location={location} 
          unit={unit} 
        />

        {/* 2. 7-DAY FORECAST | INTERACTIVE MAP (GRID 1) */}
        <div className="dashboard-grid grid-7day-map">
          <DailyForecast 
            dailyData={weatherData.daily} 
            unit={unit} 
          />

          <WeatherMap 
            location={location} 
            weatherData={weatherData} 
            onMapClick={handleSelectLocation}
            unit={unit}
          />
        </div>

        {/* 3. HOURLY FORECAST (BELOW 7-DAY & MAP) */}
        <HourlyForecast 
          hourlyData={weatherData.hourly} 
          unit={unit} 
        />

        {/* 4. CURRENT CONDITIONS | SUNRISE / SUNSET (GRID 2) */}
        <div className="dashboard-grid grid-current-sun">
          <CurrentWeather 
            weather={weatherData} 
            unit={unit} 
          />

          <SunriseSunset 
            sunriseStr={weatherData.daily[0]?.sunrise}
            sunsetStr={weatherData.daily[0]?.sunset}
            isDay={weatherData.current.isDay}
          />
        </div>

        {/* 5. WIND | UV | HUMIDITY | VISIBILITY | PRESSURE (5 CARDS ROW) */}
        <WeatherDetails 
          weather={weatherData} 
          unit={unit}
        />
      </div>
    </div>
  );
}

export default App;
