import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
};

export default function HourlyForecast({ hourlyData, unit }) {
  const scrollRef = useRef(null);

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
    <div className="glass-panel hourly-forecast-panel">
      <div className="hourly-header">
        <h3 className="hourly-title">Hourly Forecast (24h)</h3>
        
        {/* Desktop Carousel Navigation Arrows */}
        <div className="hourly-nav-btns">
          <button
            type="button"
            onClick={handleScrollLeft}
            className="hourly-nav-btn"
            title="Scroll left"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={handleScrollRight}
            className="hourly-nav-btn"
            title="Scroll right"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="custom-scrollbar hourly-scroll-container" 
      >
        {hourlyData.slice(0, 24).map((hour, index) => {
          const isNow = index === 0;
          const temp = formatTemp(hour.temperature, unit);

          return (
            <div
              key={index}
              className={`hourly-card ${isNow ? 'hourly-card-now' : ''}`}
            >
              <span className={`hourly-time ${isNow ? 'hourly-time-now' : ''}`}>
                {isNow ? 'Now' : hour.time}
              </span>

              <div className="hourly-icon-wrapper">
                <WeatherIcon conditionKey={hour.conditionKey || 'clear'} size={24} />
              </div>

              <span className="hourly-temp">{temp}°</span>

              {/* Precipitation probability in every card */}
              <span className="hourly-precip">
                💧 {hour.precipitationProbability || 0}%
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        .hourly-forecast-panel {
          padding: 16px 20px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: hidden;
        }
        .hourly-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .hourly-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }
        .hourly-nav-btns {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hourly-nav-btn {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          border: 1px solid var(--card-border);
          background: rgba(15, 25, 45, 0.6);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .hourly-nav-btn:hover {
          background: var(--card-bg-hover);
          border-color: var(--card-border-hover);
          color: var(--accent-color);
        }
        .hourly-scroll-container {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
          width: 100%;
          scroll-snap-type: x mandatory;
        }
        .hourly-card {
          flex: 0 0 74px;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 12px 6px;
          border-radius: 14px;
          border: 1px solid var(--card-border);
          background: rgba(15, 25, 45, 0.5);
          transition: var(--transition-fast);
          min-height: 118px;
          user-select: none;
        }
        .hourly-card:hover {
          background: var(--card-bg-hover);
          border-color: var(--card-border-hover);
          transform: translateY(-2px);
        }
        .hourly-card-now {
          border-color: var(--accent-color) !important;
          background: var(--accent-glow) !important;
          box-shadow: 0 0 10px var(--accent-glow);
        }
        .hourly-time {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .hourly-time-now {
          font-weight: 700;
          color: var(--accent-color);
        }
        .hourly-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2px 0;
        }
        .hourly-temp {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .hourly-precip {
          font-size: 10px;
          font-weight: 600;
          color: #38bdf8;
        }
        @media (max-width: 640px) {
          .hourly-forecast-panel {
            padding: 14px;
          }
          .hourly-nav-btns {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
