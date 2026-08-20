import React, { useState } from 'react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return celsius;
};

export default function WeeklyWaveChart({ dailyData = [], unit = 'C' }) {
  const [activeIdx, setActiveIdx] = useState(3); // Default index 3 (e.g. Wednesday)

  if (!dailyData || dailyData.length === 0) return null;

  const displayData = dailyData.slice(0, 7);
  const temps = displayData.map((d) => formatTemp(d.maxTemp, unit));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  // Compute SVG Points & Smooth Catmull-Rom or Cubic Bezier Spline
  const width = 760;
  const height = 160;
  const paddingX = 50;
  const paddingY = 45;
  const stepX = (width - paddingX * 2) / (displayData.length - 1);

  const points = temps.map((temp, i) => {
    const x = paddingX + i * stepX;
    const norm = (temp - minTemp) / range;
    const y = height - paddingY - norm * (height - paddingY * 2);
    return { x, y, temp, day: displayData[i] };
  });

  // Generate smooth cubic bezier SVG path definition
  const buildSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const pathD = buildSmoothPath(points);
  const activePt = points[activeIdx] || points[0];

  return (
    <div className="weekly-wave-container sk-panel">
      <div className="weekly-wave-header">
        <div className="weekly-title-row">
          <span className="sk-label">WEEKLY TEMPERATURE TRAJECTORY</span>
          <span className="weekly-subtitle">Atmospheric Trend Analysis</span>
        </div>
      </div>

      <div className="svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="wave-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--text-secondary)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--text-secondary)" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Active Vertical Guideline */}
          {activePt && (
            <line
              x1={activePt.x}
              y1={20}
              x2={activePt.x}
              y2={height - 20}
              stroke="var(--accent-primary)"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          )}

          {/* Smooth Temperature Spline */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#waveLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Node Points */}
          {points.map((pt, idx) => {
            const isActive = idx === activeIdx;
            return (
              <g
                key={idx}
                className="wave-node-group"
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                {isActive && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill="var(--accent-primary)"
                    opacity="0.25"
                    filter="url(#glow)"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? "5" : "3.5"}
                  fill={isActive ? "#ffffff" : "var(--text-secondary)"}
                  stroke={isActive ? "var(--accent-primary)" : "var(--bg-primary)"}
                  strokeWidth="2"
                  className="wave-circle"
                />
              </g>
            );
          })}
        </svg>

        {/* Overlay Day Labels & Temp Numbers aligned under SVG points */}
        <div className="wave-labels-layer">
          {points.map((pt, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={idx}
                className={`wave-label-col ${isActive ? 'wave-label-active' : ''}`}
                style={{ left: `${(pt.x / width) * 100}%` }}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                <span className="wave-day-name">{pt.day.dayName}</span>

                <div className="wave-temp-pill">
                  <WeatherIcon conditionKey={pt.day.conditionKey} size={14} />
                  <span className="wave-temp-val">{pt.temp}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .weekly-wave-container {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .weekly-wave-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .weekly-title-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .weekly-subtitle {
          font-size: 11px;
          color: var(--text-muted);
        }

        .svg-wrapper {
          position: relative;
          width: 100%;
          height: 140px;
        }

        .wave-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .wave-node-group {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .wave-labels-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .wave-label-col {
          position: absolute;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .wave-day-name {
          position: absolute;
          top: 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: -0.01em;
        }

        .wave-label-active .wave-day-name {
          color: var(--accent-primary);
          font-weight: 700;
        }

        .wave-temp-pill {
          position: absolute;
          bottom: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid transparent;
          transition: var(--transition-fast);
        }

        .wave-label-active .wave-temp-pill {
          background: var(--bg-primary);
          border-color: var(--accent-primary);
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
        }

        .wave-temp-val {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        @media (max-width: 640px) {
          .weekly-wave-container {
            padding: 16px;
          }
          .wave-temp-val {
            font-size: 13px;
          }
          .wave-day-name {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
