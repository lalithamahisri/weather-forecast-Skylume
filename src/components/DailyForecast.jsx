import React from 'react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
};

export default function DailyForecast({ dailyData, unit }) {
  const maxTemps = dailyData.map((d) => d.maxTemp);
  const minTemps = dailyData.map((d) => d.minTemp);
  const absoluteMax = Math.max(...maxTemps);
  const absoluteMin = Math.min(...minTemps);
  const tempRange = absoluteMax - absoluteMin || 1;

  return (
    <div className="glass-panel daily-forecast-panel">
      <h3 className="daily-forecast-title">7-Day Forecast</h3>

      <div className="daily-rows-container">
        {dailyData.map((day, index) => {
          const isToday = index === 0;
          const formattedMax = formatTemp(day.maxTemp, unit);
          const formattedMin = formatTemp(day.minTemp, unit);

          // Position range bar relative to full week's absolute min and max
          const barLeft = ((day.minTemp - absoluteMin) / tempRange) * 100;
          const barWidth = ((day.maxTemp - day.minTemp) / tempRange) * 100;

          return (
            <div
              key={index}
              className={`daily-row ${isToday ? 'daily-row-today' : ''}`}
            >
              {/* Day Name */}
              <span className={`day-name ${isToday ? 'day-name-today' : ''}`}>
                {day.dayName}
              </span>

              {/* Weather Icon */}
              <div className="day-icon-wrapper">
                <WeatherIcon conditionKey={day.conditionKey} size={20} />
              </div>

              {/* Rain Probability */}
              <span className={`day-precip ${day.precipitationProbability > 5 ? 'precip-active' : ''}`}>
                💧{day.precipitationProbability}%
              </span>

              {/* Weekly Relative Range Bar */}
              <div className="day-range-bar-wrapper">
                <span className="temp-low">{formattedMin}°</span>
                
                <div className="range-bar-track">
                  <div 
                    className="range-bar-fill"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 6)}%`
                    }} 
                  />
                </div>

                <span className="temp-high">{formattedMax}°</span>
              </div>

              {/* Full Untruncated Weather Condition Text */}
              <span className="day-condition-full">
                {day.condition}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        .daily-forecast-panel {
          padding: 20px 24px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
          height: 100%;
        }
        .daily-forecast-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }
        .daily-rows-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .daily-row {
          display: grid;
          grid-template-columns: 80px 32px 42px 1fr 125px;
          align-items: center;
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(15, 25, 45, 0.4);
          border: 1px solid transparent;
          transition: var(--transition-fast);
          gap: 8px;
        }
        .daily-row:hover {
          background: var(--card-bg-hover);
          border-color: var(--card-border);
          transform: translateX(2px);
        }
        .daily-row-today {
          background: rgba(15, 25, 45, 0.7);
          border-color: rgba(56, 189, 248, 0.3);
        }
        .day-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .day-name-today {
          font-weight: 700;
          color: var(--accent-color);
        }
        .day-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .day-precip {
          font-size: 11px;
          font-weight: 700;
          color: #38bdf8;
          opacity: 0;
          text-align: left;
        }
        .precip-active {
          opacity: 1;
        }
        .day-range-bar-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }
        .temp-low {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          width: 26px;
          text-align: right;
        }
        .temp-high {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
          width: 26px;
          text-align: left;
        }
        .range-bar-track {
          position: relative;
          flex: 1;
          height: 4px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }
        .range-bar-fill {
          position: absolute;
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(to right, #38bdf8, #f59e0b);
        }
        .day-condition-full {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          text-align: right;
          white-space: nowrap;
        }
        @media (max-width: 1280px) {
          .daily-row {
            grid-template-columns: 75px 28px 38px 1fr 110px;
            padding: 8px 8px;
          }
          .day-condition-full {
            font-size: 11px;
          }
        }
        @media (max-width: 640px) {
          .daily-row {
            grid-template-columns: 65px 28px 35px 1fr;
          }
          .day-condition-full {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
