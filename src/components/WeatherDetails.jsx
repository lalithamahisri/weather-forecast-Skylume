import React from 'react';
import { Wind, Sun, Droplets, Eye, Gauge, ArrowUp } from 'lucide-react';

export default function WeatherDetails({ weather, unit }) {
  const current = weather.current;

  const getUvLevel = (uv) => {
    if (uv <= 2) return 'Low risk';
    if (uv <= 5) return 'Moderate risk';
    if (uv <= 7) return 'High risk';
    return 'Very high risk';
  };

  const getHumidityDesc = (hum) => {
    if (hum < 30) return 'Dry air';
    if (hum < 60) return 'Comfortable level';
    if (hum < 80) return 'Sticky air';
    return 'High moisture';
  };

  const getVisibilityDesc = (vis) => {
    if (vis >= 10) return 'Clear view';
    if (vis >= 5) return 'Moderate visibility';
    return 'Reduced visibility';
  };

  const getPressureDesc = (press) => {
    if (press >= 1013) return 'High pressure';
    return 'Low pressure';
  };

  const windSpeedVal = unit === 'F' ? `${Math.round(current.windSpeed * 0.621371)}` : `${current.windSpeed}`;
  const windUnitStr = unit === 'F' ? 'mph' : 'km/h';

  const visibilityVal = unit === 'F' ? `${Math.round(current.visibility * 0.621371)}` : `${current.visibility}`;
  const visibilityUnitStr = unit === 'F' ? 'mi' : 'km';

  return (
    <div className="condition-cards-row">
      {/* 1. Wind Card */}
      <div className="glass-panel condition-card">
        <div className="card-top-row">
          <div>
            <div className="card-label">
              <Wind size={13} style={{ color: '#94a3b8' }} />
              <span>Wind</span>
            </div>
            <div className="card-val">
              {windSpeedVal} <span className="unit-sub">{windUnitStr}</span>
            </div>
          </div>
          
          <div className="compass-widget">
            <span className="compass-n">N</span>
            <div 
              className="compass-arrow"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            >
              <ArrowUp size={12} style={{ color: 'var(--accent-color)' }} />
            </div>
          </div>
        </div>

        <span className="card-context-line">From {current.windDirection}°</span>
      </div>

      {/* 2. UV Index Card */}
      <div className="glass-panel condition-card">
        <div>
          <div className="card-label">
            <Sun size={13} style={{ color: '#fde047' }} />
            <span>UV Index</span>
          </div>
          <div className="card-val">{current.uvIndex}</div>
        </div>
        
        <div>
          <div className="uv-scale-bar">
            <div className="uv-scale-fill" style={{ width: `${Math.min((current.uvIndex / 12) * 100, 100)}%` }} />
          </div>
          <span className="card-context-line">{getUvLevel(current.uvIndex)}</span>
        </div>
      </div>

      {/* 3. Humidity Card */}
      <div className="glass-panel condition-card">
        <div>
          <div className="card-label">
            <Droplets size={13} style={{ color: '#38bdf8' }} />
            <span>Humidity</span>
          </div>
          <div className="card-val">{current.humidity}%</div>
        </div>
        <span className="card-context-line">{getHumidityDesc(current.humidity)}</span>
      </div>

      {/* 4. Visibility Card */}
      <div className="glass-panel condition-card">
        <div>
          <div className="card-label">
            <Eye size={13} style={{ color: '#a7f3d0' }} />
            <span>Visibility</span>
          </div>
          <div className="card-val">
            {visibilityVal} <span className="unit-sub">{visibilityUnitStr}</span>
          </div>
        </div>
        <span className="card-context-line">{getVisibilityDesc(current.visibility)}</span>
      </div>

      {/* 5. Pressure Card */}
      <div className="glass-panel condition-card">
        <div>
          <div className="card-label">
            <Gauge size={13} style={{ color: '#c084fc' }} />
            <span>Pressure</span>
          </div>
          <div className="card-val">
            {current.pressure} <span className="unit-sub">hPa</span>
          </div>
        </div>
        <span className="card-context-line">{getPressureDesc(current.pressure)}</span>
      </div>

      <style>{`
        .condition-cards-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          width: 100%;
        }
        .condition-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 120px;
          border-radius: 18px;
        }
        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .card-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .card-val {
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-display);
          color: var(--text-primary);
          margin-top: 4px;
        }
        .unit-sub {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .compass-widget {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 25, 45, 0.4);
        }
        .compass-n {
          font-size: 7px;
          font-weight: 800;
          color: var(--text-muted);
          position: absolute;
          top: 1px;
        }
        .compass-arrow {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .uv-scale-bar {
          height: 4px;
          width: 100%;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 2px;
        }
        .uv-scale-fill {
          height: 100%;
          background: linear-gradient(to right, #4ade80, #facc15, #f87171);
          border-radius: 10px;
        }
        .card-context-line {
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 500;
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 1024px) {
          .condition-cards-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 640px) {
          .condition-cards-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 400px) {
          .condition-cards-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
