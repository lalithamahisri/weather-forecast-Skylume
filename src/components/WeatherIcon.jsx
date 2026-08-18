import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog
} from 'lucide-react';

export default function WeatherIcon({ conditionKey, isDay = true, size = 24, className = '' }) {
  const iconProps = {
    size,
    className,
    style: { flexShrink: 0, pointerEvents: 'none' }
  };

  switch (conditionKey) {
    case 'clear':
      if (isDay) {
        return <Sun {...iconProps} style={{ ...iconProps.style, color: '#facc15' }} />;
      }
      return <Moon {...iconProps} style={{ ...iconProps.style, color: '#e2e8f0' }} />;

    case 'cloudy':
      if (isDay) {
        return <CloudSun {...iconProps} style={{ ...iconProps.style, color: '#38bdf8' }} />;
      }
      return <CloudMoon {...iconProps} style={{ ...iconProps.style, color: '#94a3b8' }} />;

    case 'overcast':
      return <Cloud {...iconProps} style={{ ...iconProps.style, color: '#94a3b8' }} />;

    case 'rain':
      return <CloudRain {...iconProps} style={{ ...iconProps.style, color: '#38bdf8' }} />;

    case 'drizzle':
      return <CloudDrizzle {...iconProps} style={{ ...iconProps.style, color: '#7dd3fc' }} />;

    case 'thunderstorm':
      return <CloudLightning {...iconProps} style={{ ...iconProps.style, color: '#fbbf24' }} />;

    case 'snow':
      return <Snowflake {...iconProps} style={{ ...iconProps.style, color: '#bae6fd' }} />;

    case 'fog':
      return <CloudFog {...iconProps} style={{ ...iconProps.style, color: '#cbd5e1' }} />;

    default:
      return isDay ? (
        <Sun {...iconProps} style={{ ...iconProps.style, color: '#facc15' }} />
      ) : (
        <Moon {...iconProps} style={{ ...iconProps.style, color: '#e2e8f0' }} />
      );
  }
}
