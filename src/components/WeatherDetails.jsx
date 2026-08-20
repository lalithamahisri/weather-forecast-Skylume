import React from 'react';
import { Wind, Sun, Droplets, Eye, Gauge, Thermometer, Cloud, Sunrise, Sunset } from 'lucide-react';

export default function WeatherDetails({ weather, unit }) {
  const current = weather.current;

  // Convert values based on selected unit
  const windVal = unit === 'F' ? Math.round(current.windSpeed * 0.621371) : current.windSpeed;
  const windUnit = unit === 'F' ? 'mph' : 'km/h';

  const visVal = unit === 'F' ? Math.round(current.visibility * 0.621371) : current.visibility;
  const visUnit = unit === 'F' ? 'mi' : 'km';

  const dewPointVal = unit === 'F' ? Math.round((current.dewPoint * 9) / 5 + 32) : current.dewPoint;

  const sunriseTime = weather.daily[0]?.sunrise || '06:00';
  const sunsetTime = weather.daily[0]?.sunset || '18:30';

  const metrics = [
    {
      id: 'humidity',
      label: 'HUMIDITY',
      icon: Droplets,
      value: `${current.humidity}%`,
      subtext: current.humidity < 40 ? 'Comfortably Dry' : 'High Moisture'
    },
    {
      id: 'wind',
      label: 'WIND',
      icon: Wind,
      value: `${windVal} ${windUnit}`,
      subtext: `Direction ${current.windDirection}°`
    },
    {
      id: 'pressure',
      label: 'PRESSURE',
      icon: Gauge,
      value: `${current.pressure} hPa`,
      subtext: current.pressure >= 1013 ? 'Steady High' : 'Low Pressure'
    },
    {
      id: 'visibility',
      label: 'VISIBILITY',
      icon: Eye,
      value: `${visVal} ${visUnit}`,
      subtext: current.visibility >= 10 ? 'Clear Atmosphere' : 'Reduced View'
    },
    {
      id: 'uv',
      label: 'UV INDEX',
      icon: Sun,
      value: `${current.uvIndex}`,
      subtext: current.uvIndex <= 2 ? 'Low Risk' : current.uvIndex <= 5 ? 'Moderate' : 'High Risk'
    },
    {
      id: 'dew-point',
      label: 'DEW POINT',
      icon: Thermometer,
      value: `${dewPointVal}°`,
      subtext: 'Condensation temp'
    },
    {
      id: 'sun-cycle',
      label: 'SUN CYCLE',
      icon: Sunrise,
      value: `${sunriseTime} / ${sunsetTime}`,
      subtext: 'Sunrise & Sunset'
    }
  ];

  return (
    <section className="details-clean-container">
      <div className="details-clean-header">
        <span className="sk-label">WEATHER TELEMETRY</span>
      </div>

      <div className="details-clean-grid">
        {metrics.map((m) => {
          const IconComp = m.icon;
          return (
            <div key={m.id} className="details-clean-item">
              <div className="item-label-row">
                <IconComp size={13} className="item-icon" />
                <span className="sk-label">{m.label}</span>
              </div>

              <span className="item-val">{m.value}</span>
              <span className="item-subtext">{m.subtext}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .details-clean-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
          border-radius: var(--card-radius);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
        }

        .details-clean-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .details-clean-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .details-clean-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 12px;
          border-radius: var(--inner-radius);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          transition: var(--transition-fast);
        }

        .details-clean-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--border-subtle);
        }

        .item-label-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .item-icon {
          color: var(--accent-primary);
        }

        .item-val {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .item-subtext {
          font-size: 10px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 1100px) {
          .details-clean-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 640px) {
          .details-clean-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
