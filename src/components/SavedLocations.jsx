import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const PRESET_LOCATIONS = [
  { name: 'Hyderabad', country: 'India', admin1: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'London', country: 'United Kingdom', admin1: 'England', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'New York', country: 'United States', admin1: 'New York', lat: 40.7128, lng: -74.0060 }
];

const formatTemp = (celsius, unit) => {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return celsius;
};

export default function SavedLocations({ currentLocation, onSelectLocation, unit }) {
  const [savedLocs, setSavedLocs] = useState(() => {
    try {
      const stored = localStorage.getItem('skylume-saved-locations');
      return stored ? JSON.parse(stored) : PRESET_LOCATIONS;
    } catch (e) {
      return PRESET_LOCATIONS;
    }
  });

  const [weatherMap, setWeatherMap] = useState({});

  useEffect(() => {
    localStorage.setItem('skylume-saved-locations', JSON.stringify(savedLocs));
  }, [savedLocs]);

  // Fetch quick weather for saved locations
  useEffect(() => {
    let isMounted = true;
    savedLocs.forEach(async (loc) => {
      if (weatherMap[loc.name]) return;
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current=temperature_2m,weather_code`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.current) {
            setWeatherMap((prev) => ({
              ...prev,
              [loc.name]: {
                temp: Math.round(data.current.temperature_2m),
                code: data.current.weather_code
              }
            }));
          }
        }
      } catch (err) {
        console.error('Fetch quick weather error:', err);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [savedLocs]);

  const removeLocation = (e, locName) => {
    e.stopPropagation();
    setSavedLocs((prev) => prev.filter((l) => l.name !== locName));
  };

  return (
    <div className="saved-chips-wrapper">
      <div className="saved-chips-header">
        <span className="sk-label">SAVED CITIES</span>
      </div>

      <div className="saved-chips-list">
        {savedLocs.map((loc) => {
          const wData = weatherMap[loc.name];
          const isSelected = currentLocation?.name?.toLowerCase() === loc.name.toLowerCase();
          const displayTemp = wData?.temp !== undefined ? formatTemp(wData.temp, unit) : '--';

          return (
            <div
              key={loc.name}
              onClick={() => onSelectLocation(loc.lat, loc.lng, loc)}
              className={`saved-city-chip ${isSelected ? 'saved-chip-active' : ''}`}
            >
              <MapPin size={12} className="chip-pin" />
              <span className="chip-city">{loc.name}</span>

              <div className="chip-weather">
                {wData?.code !== undefined && (
                  <WeatherIcon conditionKey="clear" weatherCode={wData.code} size={14} />
                )}
                <span className="chip-temp-val">{displayTemp}°</span>
              </div>

              <button
                type="button"
                onClick={(e) => removeLocation(e, loc.name)}
                className="chip-remove-btn"
                title="Remove city"
              >
                <X size={11} />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        .saved-chips-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .saved-chips-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .saved-chips-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .saved-city-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .saved-city-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-medium);
        }

        .saved-chip-active {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.4);
        }

        .chip-pin {
          color: var(--accent-primary);
        }

        .chip-city {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .chip-weather {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .chip-temp-val {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .chip-remove-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          opacity: 0.6;
          transition: var(--transition-fast);
        }

        .chip-remove-btn:hover {
          opacity: 1;
          color: var(--accent-rose);
        }
      `}</style>
    </div>
  );
}
