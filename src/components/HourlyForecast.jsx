import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return celsius;
};

export default function HourlyForecast({ hourlyData = [], unit = 'C' }) {
  const scrollRef = useRef(null);

  const displayData = hourlyData ? hourlyData.slice(0, 24) : [];

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <section className="hourly-clean-container">
      <div className="hourly-clean-header">
        <span className="sk-label">24-HOUR FORECAST</span>
        <div className="hourly-nav-btns">
          <button type="button" onClick={handleScrollLeft} className="nav-arrow" aria-label="Scroll left">
            <ChevronLeft size={15} />
          </button>
          <button type="button" onClick={handleScrollRight} className="nav-arrow" aria-label="Scroll right">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="custom-scrollbar hourly-clean-strip">
        {displayData.map((hour, idx) => {
          const isNow = idx === 0;
          const tempVal = formatTemp(hour.temperature, unit);

          return (
            <div key={idx} className={`hourly-chip ${isNow ? 'hourly-chip-now' : ''}`}>
              <span className={`chip-time ${isNow ? 'chip-time-now' : ''}`}>
                {isNow ? 'NOW' : hour.time}
              </span>

              <div className="chip-icon">
                <WeatherIcon conditionKey={hour.conditionKey || 'clear'} size={20} />
              </div>

              <span className="chip-temp">{tempVal}°</span>

              {hour.precipitationProbability > 0 ? (
                <span className="chip-precip">💧 {hour.precipitationProbability}%</span>
              ) : (
                <span className="chip-precip-empty" />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .hourly-clean-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 20px;
          border-radius: var(--card-radius);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
        }

        .hourly-clean-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hourly-nav-btns {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-arrow {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .nav-arrow:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--accent-primary);
        }

        .hourly-clean-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
          scroll-behavior: smooth;
        }

        .hourly-chip {
          flex: 0 0 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 10px 4px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          min-height: 104px;
          transition: var(--transition-fast);
        }

        .hourly-chip:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--border-subtle);
        }

        .hourly-chip-now {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .chip-time {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .chip-time-now {
          color: var(--accent-primary);
          font-weight: 700;
        }

        .chip-icon {
          margin: 4px 0;
        }

        .chip-temp {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .chip-precip {
          font-size: 10px;
          font-weight: 600;
          color: var(--accent-primary);
        }

        .chip-precip-empty {
          height: 14px;
        }

        @media (max-width: 640px) {
          .hourly-nav-btns {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
