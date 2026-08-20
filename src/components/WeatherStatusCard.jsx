import React from 'react';
import { Activity, ShieldCheck, HelpCircle } from 'lucide-react';

export default function WeatherStatusCard({ weather }) {
  if (!weather || !weather.current) return null;
  const { current } = weather;

  // Calculate an atmospheric comfort score based on humidity, UV, wind, pressure
  const humidityPenalty = Math.abs(current.humidity - 45) * 0.4;
  const uvPenalty = current.uvIndex * 3;
  const windPenalty = Math.max(0, current.windSpeed - 15) * 0.5;

  const rawScore = Math.max(10, Math.min(99, 100 - (humidityPenalty + uvPenalty + windPenalty)));
  const comfortScore = Math.round(rawScore);

  let statusLabel = 'Optimal';
  let statusColor = 'var(--accent-emerald)';
  let statusBg = 'rgba(16, 185, 129, 0.12)';

  if (comfortScore < 50) {
    statusLabel = 'Severe';
    statusColor = 'var(--accent-rose)';
    statusBg = 'rgba(244, 63, 94, 0.12)';
  } else if (comfortScore < 75) {
    statusLabel = 'Moderate';
    statusColor = 'var(--accent-amber)';
    statusBg = 'rgba(245, 158, 11, 0.12)';
  }

  return (
    <div className="weather-status-card sk-panel">
      <div className="status-card-header">
        <span className="sk-label">ATMOSPHERIC STATUS</span>
        <div className="status-help-tooltip" title="Composite index based on UV, Humidity, Wind & Pressure">
          <HelpCircle size={13} className="help-icon" />
        </div>
      </div>

      <div className="status-card-body">
        <div className="status-metric-row">
          <div className="status-score-block">
            <Activity size={16} className="activity-icon" />
            <span className="status-score-val">{comfortScore}%</span>
            <span className="status-score-label">Comfort Index</span>
          </div>

          <div
            className="status-badge-pill"
            style={{ color: statusColor, background: statusBg, borderColor: statusColor }}
          >
            <ShieldCheck size={12} />
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Mini Arc / Trend Bar */}
        <div className="status-bar-track">
          <div
            className="status-bar-fill"
            style={{
              width: `${comfortScore}%`,
              background: `linear-gradient(to right, ${statusColor}, var(--accent-primary))`
            }}
          />
        </div>
      </div>

      <style>{`
        .weather-status-card {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .status-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .help-icon {
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .help-icon:hover {
          color: var(--accent-primary);
        }

        .status-card-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .status-metric-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .status-score-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .activity-icon {
          color: var(--accent-primary);
        }

        .status-score-val {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .status-score-label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .status-badge-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 700;
        }

        .status-bar-track {
          width: 100%;
          height: 5px;
          border-radius: 5px;
          background: var(--border-subtle);
          overflow: hidden;
        }

        .status-bar-fill {
          height: 100%;
          border-radius: 5px;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
