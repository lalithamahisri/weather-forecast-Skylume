import React from 'react';
import WeatherIcon from './WeatherIcon';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return celsius;
};

export default function DailyForecast({ dailyData = [], unit = 'C' }) {
  const maxTemps = dailyData.map((d) => d.maxTemp);
  const minTemps = dailyData.map((d) => d.minTemp);
  const absoluteMax = Math.max(...(maxTemps.length ? maxTemps : [30]));
  const absoluteMin = Math.min(...(minTemps.length ? minTemps : [0]));
  const tempRange = absoluteMax - absoluteMin || 1;

  return (
    <section className="daily-clean-container">
      <div className="daily-clean-header">
        <span className="sk-label">7-DAY FORECAST</span>
      </div>

      <div className="daily-clean-list">
        {dailyData.map((day, idx) => {
          const isToday = idx === 0;
          const formattedMax = formatTemp(day.maxTemp, unit);
          const formattedMin = formatTemp(day.minTemp, unit);

          const barLeft = ((day.minTemp - absoluteMin) / tempRange) * 100;
          const barWidth = ((day.maxTemp - day.minTemp) / tempRange) * 100;

          return (
            <div key={idx} className={`daily-clean-row ${isToday ? 'row-is-today' : ''}`}>
              <div className="row-day-col">
                <span className={`row-day-name ${isToday ? 'day-highlight' : ''}`}>
                  {isToday ? 'Today' : day.dayName}
                </span>
                <span className="row-date-sub">{day.date}</span>
              </div>

              <div className="row-icon-col">
                <WeatherIcon conditionKey={day.conditionKey} size={18} />
              </div>

              <span className="row-condition-col">{day.condition}</span>

              {/* Temperature Bar */}
              <div className="row-spectrum-col">
                <span className="temp-val low-val">{formattedMin}°</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 8)}%`
                    }}
                  />
                </div>
                <span className="temp-val high-val">{formattedMax}°</span>
              </div>

              <div className="row-rain-col">
                {day.precipitationProbability > 0 ? (
                  <span className="rain-badge">💧 {day.precipitationProbability}%</span>
                ) : (
                  <span className="rain-badge-muted">0%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .daily-clean-container {
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

        .daily-clean-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .daily-clean-list {
          display: flex;
          flex-direction: column;
        }

        .daily-clean-row {
          display: grid;
          grid-template-columns: 80px 32px 130px 1fr 60px;
          align-items: center;
          gap: 12px;
          padding: 10px 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background var(--transition-fast);
        }

        .daily-clean-row:last-child {
          border-bottom: none;
        }

        .daily-clean-row:hover {
          background: rgba(255, 255, 255, 0.04);
          border-radius: var(--inner-radius);
        }

        .row-is-today {
          background: rgba(56, 189, 248, 0.06);
          border-radius: var(--inner-radius);
        }

        .row-day-col {
          display: flex;
          flex-direction: column;
        }

        .row-day-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .day-highlight {
          color: var(--accent-primary);
          font-weight: 700;
        }

        .row-date-sub {
          font-size: 10px;
          color: var(--text-muted);
        }

        .row-icon-col {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .row-condition-col {
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-spectrum-col {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .temp-val {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          width: 26px;
        }

        .low-val {
          color: var(--text-secondary);
          text-align: right;
        }

        .high-val {
          color: var(--text-primary);
          text-align: left;
        }

        .bar-track {
          position: relative;
          flex: 1;
          height: 4px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .bar-fill {
          position: absolute;
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(to right, var(--accent-primary), var(--accent-amber));
        }

        .row-rain-col {
          text-align: right;
        }

        .rain-badge {
          font-size: 11px;
          font-weight: 600;
          color: var(--accent-primary);
        }

        .rain-badge-muted {
          font-size: 11px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .daily-clean-row {
            grid-template-columns: 70px 28px 1fr 50px;
          }
          .row-condition-col {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
