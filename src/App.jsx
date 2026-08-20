import React, { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import Header from './components/Header';
import WeatherHero from './components/WeatherHero';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherMap from './components/WeatherMap';
import SavedLocations from './components/SavedLocations';
import WeatherDetails from './components/WeatherDetails';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import AtmosphericBackground from './components/AtmosphericBackground';
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
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('skylume-theme') || 'dark';
  });

const DEFAULT_SAVED_LOCATIONS = [
  { name: 'Hyderabad', country: 'India', admin1: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'London', country: 'United Kingdom', admin1: 'England', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'New York', country: 'United States', admin1: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', lat: 48.8566, lng: 2.3522 }
];

  const [savedLocs, setSavedLocs] = useState(() => {
    try {
      const stored = localStorage.getItem('skylume-saved-locations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_SAVED_LOCATIONS;
    } catch (e) {
      return DEFAULT_SAVED_LOCATIONS;
    }
  });

  // Persist saved locations to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('skylume-saved-locations', JSON.stringify(savedLocs));
    } catch (e) {
      console.error('Failed to save locations to localStorage:', e);
    }
  }, [savedLocs]);

  // Apply theme to document root & persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skylume-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleSelectLocation = (lat, lng, locDetails) => {
    if (locDetails) {
      setCoordinates(lat, lng, locDetails);
    } else {
      setCoordinates(lat, lng);
    }
  };

  const handleSearchQuery = async (queryText) => {
    await searchLocation(queryText);
  };

  const isCurrentSaved = savedLocs.some(
    (loc) => loc.name.toLowerCase() === location?.name?.toLowerCase()
  );

  const toggleSaveCurrent = () => {
    if (!location || !location.name) return;
    if (isCurrentSaved) {
      setSavedLocs((prev) =>
        prev.filter((l) => l.name.toLowerCase() !== location.name.toLowerCase())
      );
    } else {
      const newLoc = {
        name: location.name,
        country: location.country || '',
        admin1: location.admin1 || '',
        lat: location.lat,
        lng: location.lng
      };
      setSavedLocs((prev) => [newLoc, ...prev.filter((l) => l.name.toLowerCase() !== location.name.toLowerCase())]);
    }
  };

  const removeLocation = (locName) => {
    setSavedLocs((prev) => prev.filter((l) => l.name.toLowerCase() !== locName.toLowerCase()));
  };

  // Initial full skeleton loading state
  if (loading && !weatherData) {
    return (
      <div className="app-wrapper">
        <LoadingState />
      </div>
    );
  }

  // Full error state if initial load fails
  if (error && !weatherData) {
    return (
      <div className="app-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <ErrorState message={error} onRetry={refreshWeather} />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Dynamic Atmospheric Visual Background */}
      <AtmosphericBackground 
        conditionKey={weatherData?.current?.conditionKey} 
        isDay={weatherData?.current?.isDay} 
        theme={theme}
      />
      <AmbientWeatherEffects weather={weatherData} theme={theme} />

      <div className="dashboard-container">
        {/* 1. MINIMAL INTEGRATED HEADER */}
        <Header 
          onSelectLocation={handleSelectLocation}
          onSearchQuery={handleSearchQuery}
          unit={unit}
          onToggleUnit={toggleUnit}
          onUseCurrentLocation={useCurrentLocation}
          isLocating={isLocating}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Alert Banner for errors */}
        {(error || locationError) && (
          <div 
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.12)',
              backdropFilter: 'blur(12px)',
              fontSize: '13px',
              color: '#f8fafc'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span>
              <span>{locationError || error}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (locationError) clearLocationError();
                if (error) clearError();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2. PRIMARY: ATMOSPHERIC WEATHER HERO */}
        <WeatherHero 
          weather={weatherData} 
          location={location} 
          unit={unit} 
          isSaved={isCurrentSaved}
          onToggleSave={toggleSaveCurrent}
        />

        {/* 3. SECONDARY: HOURLY FORECAST STRIP */}
        <HourlyForecast 
          hourlyData={weatherData.hourly} 
          unit={unit} 
        />

        {/* 4. SUPPORTING: 2-COLUMN MAP & WEEKLY FORECAST GRID */}
        <div className="sk-main-grid">
          {/* LEFT: DARK INTERACTIVE WEATHER MAP */}
          <div className="grid-map-column">
            <WeatherMap 
              location={location} 
              weatherData={weatherData} 
              onMapClick={handleSelectLocation}
              isSaved={isCurrentSaved}
              onToggleSave={toggleSaveCurrent}
              unit={unit}
              theme={theme}
            />
          </div>

          {/* RIGHT: SAVED CITIES & 7-DAY FORECAST */}
          <div className="grid-forecast-column">
            <SavedLocations 
              savedLocs={savedLocs}
              currentLocation={location}
              onSelectLocation={handleSelectLocation}
              onRemoveLocation={removeLocation}
              onToggleSaveCurrent={toggleSaveCurrent}
              isCurrentSaved={isCurrentSaved}
              onResetDefaults={() => setSavedLocs(DEFAULT_SAVED_LOCATIONS)}
              unit={unit}
            />
            <DailyForecast 
              dailyData={weatherData.daily} 
              unit={unit} 
            />
          </div>
        </div>

        {/* 5. WEATHER TELEMETRY DETAILS */}
        <WeatherDetails 
          weather={weatherData} 
          unit={unit}
        />
      </div>
    </div>
  );
}

export default App;
