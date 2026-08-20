import React from 'react';
import { Sparkles, CloudRain, Sun, Wind, Eye, Compass } from 'lucide-react';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
};

export default function WeatherInsights({ weather, unit }) {
  if (!weather || !weather.current || !weather.hourly) return null;

  const { current, hourly, daily } = weather;

  // Compute dynamic insights from real weather data array
  const insights = [];

  // 1. Rain Insight
  const rainHours = hourly.filter((h) => h.precipitationProbability >= 40);
  if (rainHours.length > 0) {
    const firstRain = rainHours[0];
    insights.push({
      id: 'rain-insight',
      icon: CloudRain,
      color: 'var(--accent-primary)',
      title: `Rain expected around ${firstRain.time}`,
      description: `Precipitation probability reaches ${firstRain.precipitationProbability}%. Consider bringing an umbrella.`
    });
  } else if (daily[0]?.precipitationProbability > 20) {
    insights.push({
      id: 'light-rain-insight',
      icon: CloudRain,
      color: 'var(--accent-primary)',
      title: `Slight rain chance today (${daily[0].precipitationProbability}%)`,
      description: 'Overcast conditions present, but heavy rain is unlikely.'
    });
  } else {
    insights.push({
      id: 'no-rain-insight',
      icon: Sun,
      color: 'var(--accent-amber)',
      title: 'Zero rain predicted for the next 24 hours',
      description: 'Dry conditions will persist throughout the day.'
    });
  }

  // 2. Temperature Peak Insight
  let maxTempHour = hourly[0];
  hourly.forEach((h) => {
    if (h.temperature > maxTempHour.temperature) {
      maxTempHour = h;
    }
  });

  const peakTempFormatted = formatTemp(maxTempHour.temperature, unit);
  insights.push({
    id: 'temp-peak-insight',
    icon: Sun,
    color: 'var(--accent-amber)',
    title: `Peak temperature around ${maxTempHour.time} (${peakTempFormatted}°)`,
    description: `Daytime high reaches ${formatTemp(current.high, unit)}°, lowest around ${formatTemp(current.low, unit)}°.`
  });

  // 3. Wind / Air Insight
  if (current.windSpeed >= 25) {
    const speedVal = unit === 'F' ? `${Math.round(current.windSpeed * 0.621371)} mph` : `${current.windSpeed} km/h`;
    insights.push({
      id: 'wind-insight',
      icon: Wind,
      color: 'var(--accent-violet)',
      title: `Breezy conditions with winds up to ${speedVal}`,
      description: `Blowing from ${current.windDirection}°. Outdoor activities may feel windier.`
    });
  } else if (current.visibility >= 10) {
    insights.push({
      id: 'visibility-insight',
      icon: Eye,
      color: 'var(--accent-emerald)',
      title: 'Excellent visibility throughout the day',
      description: 'Atmospheric clarity is high with minimal haze.'
    });
  } else {
    insights.push({
      id: 'comfort-insight',
      icon: Compass,
      color: 'var(--accent-primary)',
      title: `Comfortable outdoor atmospheric index`,
      description: `Relative humidity at ${current.humidity}% and pressure steady at ${current.pressure} hPa.`
    });
  }

  return (
    <section className="sk-panel insights-section">
      <div className="insights-header">
        <div className="insights-title-row">
          <Sparkles size={16} className="sparkles-icon" />
          <h2 className="sk-label">WEATHER INSIGHTS</h2>
        </div>
        <span className="insights-sublabel">Calculated from live meteorological telemetry</span>
      </div>

      <div className="insights-grid">
        {insights.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="insight-card">
              <div className="insight-icon-pill" style={{ color: item.color }}>
                <IconComponent size={16} />
              </div>
              <div className="insight-content">
                <h3 className="insight-title">{item.title}</h3>
                <p className="insight-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .insights-section {
          width: 100%;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .insights-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .insights-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sparkles-icon {
          color: var(--accent-primary);
        }

        .insights-sublabel {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .insight-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--inner-radius);
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          transition: var(--transition-fast);
        }

        .insight-card:hover {
          border-color: var(--border-medium);
        }

        .insight-icon-pill {
          padding: 8px;
          border-radius: 8px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }

        .insight-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .insight-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .insight-desc {
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        @media (max-width: 1024px) {
          .insights-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
