import React from 'react';
import { MapPin, Calendar, Star, Sparkles } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return celsius;
};

export default function WeatherHero({ weather, location, unit, isSaved, onToggleSave }) {
  const current = weather.current;
  const temp = formatTemp(current.temperature, unit);
  const feelsLike = formatTemp(current.feelsLike, unit);
  const high = formatTemp(current.high, unit);
  const low = formatTemp(current.low, unit);

  // Format date (e.g. Wednesday, August 19)
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const locationBreadcrumb = [
    location.name,
    location.admin1,
    location.country
  ].filter(Boolean).join(', ');

  // Generate 1-line highlights summary text
  const getHighlightsSummary = () => {
    const parts = [];
    if (weather.hourly) {
      const rainHours = weather.hourly.filter((h) => h.precipitationProbability >= 40);
      if (rainHours.length > 0) {
        parts.push(`🌧 Rain likely around ${rainHours[0].time}`);
      }
    }
    parts.push(`☀ High ${high}° / Low ${low}°`);
    parts.push(`💨 Wind ${unit === 'F' ? Math.round(current.windSpeed * 0.621) + ' mph' : current.windSpeed + ' km/h'}`);
    parts.push(`💧 Humidity ${current.humidity}%`);
    return parts.join('   •   ');
  };

  return (
    <section className="hero-open-container">
      {/* Location & Date Context */}
      <div className="hero-meta-bar">
        <div className="hero-location-info">
          <MapPin size={15} className="hero-pin" />
          <span className="hero-location-text">{locationBreadcrumb}</span>
          <span className="meta-sep">•</span>
          <Calendar size={13} className="hero-cal" />
          <span className="hero-date-text">{todayStr}</span>
        </div>

        <button
          type="button"
          onClick={onToggleSave}
          className={`hero-bookmark-btn ${isSaved ? 'is-saved' : ''}`}
          title={isSaved ? 'Saved location' : 'Save location'}
        >
          <Star size={14} fill={isSaved ? 'currentColor' : 'none'} />
          <span>{isSaved ? 'Saved' : 'Save City'}</span>
        </button>
      </div>

      {/* Main Massive Temperature & Condition Layout */}
      <div className="hero-main-row">
        <div className="hero-temp-group">
          <div className="hero-temp-value">
            <span className="number">{temp}</span>
            <span className="deg">°</span>
          </div>

          <div className="hero-pills-col">
            <div className="pill-row">
              <span className="pill-label">Feels like</span>
              <span className="pill-value">{feelsLike}°</span>
            </div>
            <div className="pill-row">
              <span className="pill-label">H: {high}°</span>
              <span className="pill-label">L: {low}°</span>
            </div>
          </div>
        </div>

        {/* Condition Text & Visual Icon */}
        <div className="hero-condition-group">
          <div className="hero-condition-header">
            <WeatherIcon conditionKey={current.conditionKey} size={36} />
            <h1 className="hero-condition-title">{current.condition}</h1>
          </div>
          <p className="hero-condition-sub">
            {current.contextSentence || `Comfortable weather conditions throughout the day.`}
          </p>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="hero-highlights-strip">
        <Sparkles size={14} className="sparkle-icon" />
        <span className="highlights-text">{getHighlightsSummary()}</span>
      </div>

      <style>{`
        .hero-open-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px 0 12px 0;
          position: relative;
          z-index: 2;
        }

        .hero-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hero-location-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .hero-pin {
          color: var(--accent-primary);
        }

        .hero-cal {
          color: var(--text-muted);
        }

        .meta-sep {
          color: var(--text-muted);
        }

        .hero-date-text {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .hero-bookmark-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .hero-bookmark-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--accent-amber);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .hero-bookmark-btn.is-saved {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          color: var(--accent-amber);
        }

        .hero-main-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 28px;
        }

        .hero-temp-group {
          display: flex;
          align-items: flex-end;
          gap: 20px;
        }

        .hero-temp-value {
          display: flex;
          align-items: flex-start;
          line-height: 0.8;
        }

        .hero-temp-value .number {
          font-family: var(--font-display);
          font-size: 116px;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: var(--text-primary);
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        }

        .hero-temp-value .deg {
          font-family: var(--font-display);
          font-size: 54px;
          font-weight: 300;
          color: var(--text-secondary);
          margin-top: 6px;
          margin-left: -8px;
        }

        .hero-pills-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .pill-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .pill-value {
          color: var(--accent-primary);
          font-weight: 700;
        }

        .hero-condition-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 520px;
          text-align: right;
        }

        .hero-condition-header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .hero-condition-title {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          line-height: 1.05;
        }

        [data-theme="light"] .hero-temp-value .number {
          color: var(--text-primary);
          text-shadow: none;
        }

        [data-theme="light"] .hero-temp-value .deg {
          color: var(--text-secondary);
        }

        [data-theme="light"] .hero-condition-title {
          color: var(--text-primary);
        }

        .hero-condition-sub {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .hero-highlights-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          width: fit-content;
          max-width: 100%;
        }

        .sparkle-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .highlights-text {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 860px) {
          .hero-main-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .hero-condition-group {
            text-align: left;
          }
          .hero-condition-header {
            justify-content: flex-start;
          }
          .hero-temp-value .number {
            font-size: 86px;
          }
          .hero-condition-title {
            font-size: 32px;
          }
        }

        @media (max-width: 540px) {
          .hero-temp-value .number {
            font-size: 72px;
          }
          .hero-condition-title {
            font-size: 26px;
          }
        }
      `}</style>
    </section>
  );
}
