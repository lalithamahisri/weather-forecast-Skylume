import { useState, useEffect, useCallback } from 'react';

// WMO weather code mapping helper
export function mapWeatherCode(code) {
  const mapping = {
    0: { label: 'Clear Sky', key: 'clear', emoji: '☀️' },
    1: { label: 'Mainly Clear', key: 'clear', emoji: '🌤️' },
    2: { label: 'Partly Cloudy', key: 'cloudy', emoji: '⛅' },
    3: { label: 'Overcast', key: 'cloudy', emoji: '☁️' },
    45: { label: 'Foggy', key: 'fog', emoji: '🌫️' },
    48: { label: 'Depositing Rime Fog', key: 'fog', emoji: '🌫️' },
    51: { label: 'Light Drizzle', key: 'rain', emoji: '🌦️' },
    53: { label: 'Moderate Drizzle', key: 'rain', emoji: '🌦️' },
    55: { label: 'Dense Drizzle', key: 'rain', emoji: '🌧️' },
    56: { label: 'Light Freezing Drizzle', key: 'rain', emoji: '🌦️' },
    57: { label: 'Dense Freezing Drizzle', key: 'rain', emoji: '🌧️' },
    61: { label: 'Slight Rain', key: 'rain', emoji: '🌦️' },
    63: { label: 'Moderate Rain', key: 'rain', emoji: '🌧️' },
    65: { label: 'Heavy Rain', key: 'rain', emoji: '⛈️' },
    66: { label: 'Light Freezing Rain', key: 'rain', emoji: '🌦️' },
    67: { label: 'Heavy Freezing Rain', key: 'rain', emoji: '⛈️' },
    71: { label: 'Slight Snowfall', key: 'snow', emoji: '❄️' },
    73: { label: 'Moderate Snowfall', key: 'snow', emoji: '❄️' },
    75: { label: 'Heavy Snowfall', key: 'snow', emoji: '🌨️' },
    77: { label: 'Snow Grains', key: 'snow', emoji: '🌨️' },
    80: { label: 'Slight Rain Showers', key: 'rain', emoji: '🌦️' },
    81: { label: 'Moderate Rain Showers', key: 'rain', emoji: '🌧️' },
    82: { label: 'Violent Rain Showers', key: 'rain', emoji: '⛈️' },
    85: { label: 'Slight Snow Showers', key: 'snow', emoji: '🌨️' },
    86: { label: 'Heavy Snow Showers', key: 'snow', emoji: '❄️' },
    95: { label: 'Thunderstorm', key: 'thunderstorm', emoji: '⛈️' },
    96: { label: 'Thunderstorm with Slight Hail', key: 'thunderstorm', emoji: '⛈️' },
    99: { label: 'Thunderstorm with Heavy Hail', key: 'thunderstorm', emoji: '⛈️' }
  };
  return mapping[code] || { label: 'Clear Sky', key: 'clear', emoji: '🌤️' };
}

// Generate real contextual line from actual API weather data
function generateContextSentence(current, dailyMaxRainProb) {
  const { conditionKey, temperature, uvIndex, windSpeed } = current;

  if (conditionKey === 'thunderstorm') {
    return 'Thunderstorms in the area today — stay indoors if possible.';
  }
  if (conditionKey === 'rain') {
    return 'Rainy conditions today — bring an umbrella with you.';
  }
  if (conditionKey === 'snow') {
    return 'Snowfall expected today — drive carefully and dress warmly.';
  }
  if (conditionKey === 'fog') {
    return 'Foggy conditions present — reduced visibility on roads.';
  }
  if (windSpeed > 30) {
    return `High wind speeds of up to ${windSpeed} km/h recorded today.`;
  }
  if (conditionKey === 'clear' && temperature >= 30) {
    return 'Hot sunny weather today — stay hydrated!';
  }
  if (conditionKey === 'clear' && uvIndex >= 6) {
    return 'Clear skies with high UV index today — wear sun protection.';
  }
  if (dailyMaxRainProb > 30) {
    return `Cloudy skies with a ${dailyMaxRainProb}% chance of rain later today.`;
  }
  if (conditionKey === 'cloudy') {
    return 'Cloudy skies throughout the day with mild temperatures.';
  }
  return 'Clear skies and comfortable weather conditions today.';
}

const DEFAULT_LOCATION = {
  name: 'Hyderabad',
  country: 'India',
  admin1: 'Telangana',
  lat: 17.3850,
  lng: 78.4867
};

export function useWeather() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const fetchWeather = useCallback(async (lat, lng, locDetails) => {
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,is_day,dew_point_2m,cloud_cover&hourly=temperature_2m,weather_code,precipitation_probability,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to retrieve weather data.');
      }
      
      const data = await response.json();
      
      const now = new Date();
      const currentIsoHour = new Date(now.setMinutes(0, 0, 0)).toISOString().slice(0, 13) + ':00';
      
      let currentUvIndex = 0;
      let currentVisibility = 10000;
      
      const hourlyIndex = data.hourly.time.findIndex(t => t.startsWith(currentIsoHour.slice(0, 13)));
      if (hourlyIndex !== -1) {
        currentUvIndex = data.hourly.uv_index[hourlyIndex] || 0;
        currentVisibility = data.hourly.visibility[hourlyIndex] || 10000;
      } else if (data.hourly.uv_index.length > 0) {
        currentUvIndex = data.hourly.uv_index[12] || 0;
        currentVisibility = data.hourly.visibility[0] || 10000;
      }

      const mappedCurrentCondition = mapWeatherCode(data.current.weather_code);
      const maxRainProbToday = data.daily.precipitation_probability_max?.[0] || 0;

      const currentMetrics = {
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        condition: mappedCurrentCondition.label,
        conditionKey: mappedCurrentCondition.key,
        emoji: mappedCurrentCondition.emoji,
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: data.current.wind_direction_10m,
        visibility: Math.round(currentVisibility / 1000),
        pressure: Math.round(data.current.pressure_msl),
        uvIndex: Math.round(currentUvIndex),
        dewPoint: data.current.dew_point_2m !== undefined ? Math.round(data.current.dew_point_2m) : Math.round(data.current.temperature_2m - ((100 - data.current.relative_humidity_2m) / 5)),
        cloudCover: data.current.cloud_cover !== undefined ? Math.round(data.current.cloud_cover) : 40,
        isDay: data.current.is_day === 1,
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0]),
        weatherCode: data.current.weather_code
      };

      const contextSentence = generateContextSentence(currentMetrics, maxRainProbToday);

      const weather = {
        current: {
          ...currentMetrics,
          contextSentence
        },
        hourly: data.hourly.time.slice(0, 24).map((timeStr, index) => {
          const time = new Date(timeStr);
          const mapped = mapWeatherCode(data.hourly.weather_code[index]);
          return {
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            rawTime: time,
            temperature: Math.round(data.hourly.temperature_2m[index]),
            condition: mapped.label,
            emoji: mapped.emoji,
            precipitationProbability: data.hourly.precipitation_probability[index] || 0
          };
        }),
        daily: data.daily.time.map((timeStr, index) => {
          const date = new Date(timeStr);
          const mapped = mapWeatherCode(data.daily.weather_code[index]);
          const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          return {
            dayName,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            maxTemp: Math.round(data.daily.temperature_2m_max[index]),
            minTemp: Math.round(data.daily.temperature_2m_min[index]),
            condition: mapped.label,
            conditionKey: mapped.key,
            emoji: mapped.emoji,
            precipitationProbability: data.daily.precipitation_probability_max[index] || 0,
            sunrise: data.daily.sunrise[index] ? (() => {
              const d = new Date(data.daily.sunrise[index]);
              return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            })() : '',
            sunset: data.daily.sunset[index] ? (() => {
              const d = new Date(data.daily.sunset[index]);
              return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            })() : '',
            uvIndex: Math.round(data.daily.uv_index_max[index] || 0)
          };
        })
      };

      setWeatherData(weather);
      if (locDetails) {
        setLocation(locDetails);
      }
    } catch (err) {
      console.error('Fetch weather error:', err);
      setError(err.message || 'Couldn\'t retrieve weather information for this location.');
    } finally {
      setLoading(false);
    }
  }, []);

  const setCoordinates = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
        {
          headers: {
            'User-Agent': 'SkylumeApp/1.0 (contact: custom-weather-app)'
          }
        }
      );
      
      let locDetails = {
        lat,
        lng,
        name: 'Selected Point',
        country: '',
        admin1: ''
      };

      if (response.ok) {
        const addressData = await response.json();
        const address = addressData?.address;
        
        const name = address 
          ? (address.city || address.town || address.village || address.suburb || address.county || address.state || 'Map Point')
          : 'Map Point';
        const country = address?.country || '';
        const admin1 = address?.state || address?.region || '';
        
        locDetails = { lat, lng, name, country, admin1 };
      }
      
      await fetchWeather(lat, lng, locDetails);
    } catch (err) {
      console.error('Reverse geocode error:', err);
      const fallbackLoc = {
        lat,
        lng,
        name: `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`,
        country: '',
        admin1: ''
      };
      await fetchWeather(lat, lng, fallbackLoc);
    }
  }, [fetchWeather]);

  const searchLocation = useCallback(async (queryText) => {
    if (!queryText || !queryText.trim()) return false;
    setError(null);
    setLocationError(null);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          queryText.trim()
        )}&count=1&language=en&format=json`
      );
      if (!res.ok) {
        throw new Error('Geocoding service unavailable');
      }
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setError(`Couldn't find "${queryText}". Try another city or location.`);
        return false;
      }
      const item = data.results[0];
      const locDetails = {
        name: item.name,
        country: item.country || '',
        admin1: item.admin1 || '',
        lat: item.latitude,
        lng: item.longitude
      };
      await fetchWeather(item.latitude, item.longitude, locDetails);
      return true;
    } catch (err) {
      console.error('Search location error:', err);
      setError(`Couldn't find weather for "${queryText}". Try another city.`);
      return false;
    }
  }, [fetchWeather]);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support geolocation.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await setCoordinates(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        console.error('Browser geolocation error:', err);
        setIsLocating(false);
        if (err.code === 1) {
          setLocationError('Location access was denied. Search for a city instead.');
        } else {
          setLocationError('Unable to detect your location. Please search for a city manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [setCoordinates]);

  useEffect(() => {
    fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, DEFAULT_LOCATION);
  }, [fetchWeather]);

  return {
    location,
    weatherData,
    loading,
    error,
    isLocating,
    locationError,
    fetchWeather,
    setCoordinates,
    searchLocation,
    useCurrentLocation,
    clearLocationError: () => setLocationError(null),
    clearError: () => setError(null),
    refreshWeather: () => fetchWeather(location.lat, location.lng, location)
  };
}
