import React from 'react';
import { CloudLightning, Compass, Loader2 } from 'lucide-react';
import LocationSearch from './LocationSearch';

export default function Header({
  onSelectLocation,
  onSearchQuery,
  unit,
  onToggleUnit,
  onUseCurrentLocation,
  isLocating
}) {
  return (
    <header className="glass-panel app-header">
      {/* Brand logo left */}
      <div
        className="brand-logo"
        onClick={() => window.location.reload()}
        title="Skylume Dashboard"
      >
        <CloudLightning size={24} className="logo-icon" />
        <span className="logo-text">Skylume</span>
      </div>

      {/* Centered search bar */}
      <div className="header-search-container">
        <LocationSearch onSelectLocation={onSelectLocation} onSearchQuery={onSearchQuery} />
      </div>

      {/* Action controls right */}
      <div className="header-actions">
        {/* Geolocation button */}
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="header-action-btn location-btn"
          title="Use current location"
        >
          {isLocating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="btn-label">Locating...</span>
            </>
          ) : (
            <>
              <Compass size={16} />
              <span className="btn-label">Location</span>
            </>
          )}
        </button>

        {/* Temperature unit switch (°C / °F) */}
        <button
          type="button"
          onClick={onToggleUnit}
          className="header-action-btn unit-toggle-btn"
          title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
        >
          °{unit}
        </button>
      </div>

      <style>{`
        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          gap: 16px;
          width: 100%;
          border-radius: 20px;
          position: relative;
          z-index: 1000;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .logo-icon {
          color: var(--accent-color);
          stroke-width: 2.2;
        }
        .logo-text {
          font-size: 20px;
          font-family: var(--font-display);
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #f8fafc 30%, var(--accent-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-search-container {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 420px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .header-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid var(--card-border);
          background: rgba(15, 25, 45, 0.6);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .header-action-btn:hover {
          background: var(--card-bg-hover);
          border-color: var(--card-border-hover);
          transform: translateY(-1px);
        }
        .header-action-btn:active {
          transform: translateY(0);
        }
        .unit-toggle-btn {
          width: 40px;
          height: 40px;
          padding: 0;
          font-size: 14px;
          font-weight: 700;
        }
        @media (max-width: 640px) {
          .btn-label {
            display: none;
          }
          .app-header {
            padding: 10px 12px;
          }
          .logo-text {
            font-size: 17px;
          }
        }
      `}</style>
    </header>
  );
}
