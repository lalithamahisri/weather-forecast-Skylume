import React from 'react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
};

export default function WeatherHero({ weather, location, unit }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const current = weather.current;
  const temp = formatTemp(current.temperature, unit);
  const feelsLike = formatTemp(current.feelsLike, unit);
  const high = formatTemp(current.high, unit);
  const low = formatTemp(current.low, unit);

  return (
    <section className="glass-panel hero-section">
      <div className="hero-content">
        <span className="hero-greeting">{getGreeting()}</span>

        <h1 className="hero-location">{location.name}</h1>

        <div className="hero-main-temp-row">
          <span className="hero-temp-value">{temp}°</span>
          <WeatherIcon 
            conditionKey={current.conditionKey} 
            isDay={current.isDay} 
            size={52} 
            className="hero-weather-icon"
          />
        </div>

        <div className="hero-condition-text">{current.condition}</div>

        <div className="hero-stats-row">
          <span>Feels like {feelsLike}°</span>
          <span className="hero-divider">•</span>
          <span>H: {high}°</span>
          <span className="hero-divider">•</span>
          <span>L: {low}°</span>
        </div>

        {/* Dynamic contextual summary generated from API weather metrics */}
        {current.contextSentence && (
          <p className="hero-context-sentence">
            "{current.contextSentence}"
          </p>
        )}
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(15, 25, 45, 0.75) 0%, rgba(22, 36, 64, 0.6) 100%);
          border: 1px solid var(--card-border);
          box-shadow: 0 8px 32px var(--shadow-color);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          max-width: 600px;
        }
        .hero-greeting {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-secondary);
        }
        .hero-location {
          font-size: 28px;
          font-weight: 800;
          font-family: var(--font-display);
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-top: 2px;
        }
        .hero-main-temp-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 4px 0;
        }
        .hero-temp-value {
          font-size: 84px;
          font-weight: 800;
          font-family: var(--font-display);
          line-height: 0.9;
          letter-spacing: -0.05em;
          color: var(--text-primary);
        }
        .hero-weather-icon {
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        }
        .hero-condition-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .hero-stats-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .hero-divider {
          opacity: 0.4;
        }
        .hero-context-sentence {
          font-size: 13px;
          font-weight: 500;
          color: var(--accent-color);
          margin-top: 8px;
          padding: 5px 14px;
          border-radius: 20px;
          background: var(--accent-glow);
          border: 1px solid rgba(56, 189, 248, 0.2);
          line-height: 1.4;
        }
        @media (max-width: 640px) {
          .hero-section {
            padding: 20px 16px;
          }
          .hero-location {
            font-size: 22px;
          }
          .hero-temp-value {
            font-size: 64px;
          }
          .hero-condition-text {
            font-size: 16px;
          }
          .hero-stats-row {
            font-size: 12px;
            gap: 6px;
          }
        }
      `}</style>
    </section>
  );
}
