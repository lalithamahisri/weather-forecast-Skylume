import React from 'react';
import { Compass, Loader2, Sun, Moon } from 'lucide-react';
import LocationSearch from './LocationSearch';

export default function Header({
  onSelectLocation,
  onSearchQuery,
  unit,
  onToggleUnit,
  onUseCurrentLocation,
  isLocating,
  theme,
  onToggleTheme
}) {
  return (
    <header className="app-header-clean">
      {/* Brand logo left */}
      <div className="brand-block-clean" onClick={() => window.location.reload()} title="Skylume Weather">
        <span className="brand-title">SKYLUME</span>
        <span className="brand-subtitle">WEATHER INTELLIGENCE</span>
      </div>

      {/* Center Search Bar */}
      <div className="header-search-box">
        <LocationSearch onSelectLocation={onSelectLocation} onSearchQuery={onSearchQuery} />
      </div>

      {/* Action Controls Right */}
      <div className="header-actions-clean">
        {/* Geolocation Button */}
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="clean-btn"
          title="Use my current location"
        >
          {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Compass size={14} />}
          <span className="btn-label">My Location</span>
        </button>

        {/* °C / °F Unit Switcher */}
        <button
          type="button"
          onClick={onToggleUnit}
          className="clean-btn unit-switch-btn"
          title={`Switch temperature unit to °${unit === 'C' ? 'F' : 'C'}`}
        >
          <span className={unit === 'C' ? 'unit-active' : ''}>°C</span>
          <span className="unit-slash">/</span>
          <span className={unit === 'F' ? 'unit-active' : ''}>°F</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="clean-btn theme-switch-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      <style>{`
        .app-header-clean {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          gap: 16px;
          width: 100%;
          position: relative;
          z-index: 100;
        }

        .brand-block-clean {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          user-select: none;
        }

        .brand-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          line-height: 1;
        }

        .brand-subtitle {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .header-search-box {
          flex: 1;
          max-width: 420px;
        }

        .header-actions-clean {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .clean-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .clean-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--border-medium);
          color: var(--accent-primary);
        }

        .unit-switch-btn {
          padding: 0 10px;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          gap: 3px;
        }

        .unit-active {
          color: var(--accent-primary);
        }

        .unit-slash {
          color: var(--text-muted);
          font-weight: 400;
        }

        .theme-switch-btn {
          padding: 0 10px;
        }

        @media (max-width: 768px) {
          .btn-label,
          .brand-subtitle {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
