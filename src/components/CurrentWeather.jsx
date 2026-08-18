import React from 'react';
import { Droplets, Wind, Eye, Sun } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
};

export default function CurrentWeather({ weather, unit }) {
  const current = weather.current;

  const windValue = unit === 'F' ? `${Math.round(current.windSpeed * 0.621371)} mph` : `${current.windSpeed} km/h`;
  const visibilityValue = unit === 'F' ? `${Math.round(current.visibility * 0.621371)} mi` : `${current.visibility} km`;

  const stats = [
    { label: 'Humidity', value: `${current.humidity}%`, icon: Droplets, color: '#38bdf8' },
    { label: 'Wind', value: windValue, icon: Wind, color: '#94a3b8' },
    { label: 'Visibility', value: visibilityValue, icon: Eye, color: '#a7f3d0' },
    { label: 'UV Index', value: current.uvIndex, icon: Sun, color: '#fde047' }
  ];

  const temp = formatTemp(current.temperature, unit);
  const feelsLike = formatTemp(current.feelsLike, unit);
  const high = formatTemp(current.high, unit);
  const low = formatTemp(current.low, unit);

  return (
    <div className="glass-panel current-conditions-panel">
      <div>
        <h3 className="panel-title">Current Conditions</h3>
        
        <div className="summary-main-row">
          <div>
            <div className="current-temp-big">
              {temp}°{unit}
            </div>
            <div className="current-condition-name">
              {current.condition}
            </div>
            <div className="current-subtext">
              Feels like {feelsLike}° &bull; H: {high}° L: {low}°
            </div>
          </div>

          <div className="current-icon-wrapper">
            <WeatherIcon conditionKey={current.conditionKey} isDay={current.isDay} size={46} />
          </div>
        </div>
      </div>

      <div className="stats-quick-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="quick-stat-item">
              <div className="stat-label">
                <Icon size={12} style={{ color: stat.color }} />
                <span>{stat.label}</span>
              </div>
              <span className="stat-value">{stat.value}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .current-conditions-panel {
          padding: 20px 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 200px;
        }
        .panel-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }
        .summary-main-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .current-temp-big {
          font-size: 36px;
          font-weight: 800;
          font-family: var(--font-display);
          color: var(--text-primary);
          line-height: 1.1;
        }
        .current-condition-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 2px;
        }
        .current-subtext {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .current-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stats-quick-grid {
          border-top: 1px solid var(--card-border);
          padding-top: 12px;
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 16px;
        }
        .quick-stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .stat-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stat-value {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
