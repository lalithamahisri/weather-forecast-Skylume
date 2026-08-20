import React, { useState, useEffect } from 'react';
import { MapPin, X, Plus, Star, RotateCcw } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return celsius;
};

export default function SavedLocations({
  savedLocs = [],
  currentLocation,
  onSelectLocation,
  onRemoveLocation,
  onToggleSaveCurrent,
  isCurrentSaved,
  onResetDefaults,
  unit = 'C'
}) {
  const [weatherMap, setWeatherMap] = useState({});

  // Fetch quick weather for saved locations
  useEffect(() => {
    let isMounted = true;
    if (!savedLocs || savedLocs.length === 0) return;

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

  const handleRemove = (e, locName) => {
    e.stopPropagation();
    if (onRemoveLocation) {
      onRemoveLocation(locName);
    }
  };

  return (
    <div className="saved-chips-wrapper">
      <div className="saved-chips-header">
        <div className="saved-header-title">
          <Star size={13} className="saved-header-star" />
          <span className="sk-label">SAVED CITIES</span>
          {savedLocs.length > 0 && (
            <span className="saved-count-pill">{savedLocs.length}</span>
          )}
        </div>

        <div className="saved-header-actions">
          {!isCurrentSaved && currentLocation?.name && (
            <button
              type="button"
              onClick={onToggleSaveCurrent}
              className="saved-action-btn add-current-btn"
              title={`Save ${currentLocation.name} to favorites`}
            >
              <Plus size={12} />
              <span>Save {currentLocation.name.split(',')[0]}</span>
            </button>
          )}

          {savedLocs.length === 0 && (
            <button
              type="button"
              onClick={onResetDefaults}
              className="saved-action-btn reset-btn"
              title="Restore popular cities"
            >
              <RotateCcw size={12} />
              <span>Restore Popular</span>
            </button>
          )}
        </div>
      </div>

      <div className="saved-chips-list">
        {savedLocs.length === 0 ? (
          <div className="saved-empty-box">
            <span className="saved-empty-text">No saved cities yet.</span>
            {currentLocation?.name && (
              <button
                type="button"
                onClick={onToggleSaveCurrent}
                className="saved-empty-add-btn"
              >
                <Plus size={13} />
                <span>Save {currentLocation.name}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onResetDefaults}
              className="saved-empty-restore-btn"
            >
              <RotateCcw size={13} />
              <span>Load Preset Cities</span>
            </button>
          </div>
        ) : (
          savedLocs.map((loc) => {
            const wData = weatherMap[loc.name];
            const isSelected =
              currentLocation?.name?.toLowerCase() === loc.name.toLowerCase();
            const displayTemp =
              wData?.temp !== undefined ? formatTemp(wData.temp, unit) : '--';

            return (
              <div
                key={`${loc.name}-${loc.lat}`}
                onClick={() => onSelectLocation(loc.lat, loc.lng, loc)}
                className={`saved-city-chip ${isSelected ? 'saved-chip-active' : ''}`}
                title={`View forecast for ${loc.name}`}
              >
                <MapPin size={12} className="chip-pin" />
                <span className="chip-city">{loc.name}</span>

                <div className="chip-weather">
                  {wData?.code !== undefined && (
                    <WeatherIcon
                      conditionKey="clear"
                      weatherCode={wData.code}
                      size={14}
                    />
                  )}
                  <span className="chip-temp-val">{displayTemp}°</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleRemove(e, loc.name)}
                  className="chip-remove-btn"
                  title={`Remove ${loc.name}`}
                  aria-label={`Remove ${loc.name}`}
                >
                  <X size={11} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .saved-chips-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .saved-chips-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .saved-header-title {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .saved-header-star {
          color: var(--accent-amber);
        }

        .saved-count-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 10px;
        }

        .saved-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .saved-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-secondary);
        }

        .saved-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .add-current-btn {
          border-color: rgba(56, 189, 248, 0.3);
          color: var(--accent-primary);
        }

        .add-current-btn:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.6);
        }

        .saved-chips-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          min-height: 36px;
        }

        .saved-empty-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--border-subtle);
          width: 100%;
        }

        .saved-empty-text {
          font-size: 12px;
          color: var(--text-muted);
        }

        .saved-empty-add-btn, .saved-empty-restore-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          transition: var(--transition-fast);
        }

        .saved-empty-add-btn {
          color: var(--accent-primary);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .saved-empty-add-btn:hover, .saved-empty-restore-btn:hover {
          background: rgba(255, 255, 255, 0.12);
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
          user-select: none;
        }

        .saved-city-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-medium);
          transform: translateY(-1px);
        }

        .saved-chip-active {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.15);
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
          justify-content: center;
          padding: 2px;
          border-radius: 50%;
          opacity: 0.5;
          transition: var(--transition-fast);
          margin-left: 2px;
        }

        .chip-remove-btn:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.2);
          color: var(--accent-rose);
        }
      `}</style>
    </div>
  );
}
