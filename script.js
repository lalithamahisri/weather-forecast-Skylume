/**
 * SKYLUME WEATHER INTELLIGENCE - DEEP DARK LIVE WEATHER STAGE ENGINE & APP LOGIC
 */

// Default Fallback Location (London, UK)
const DEFAULT_LOCATION = {
  name: 'London',
  country: 'United Kingdom',
  admin1: 'England',
  lat: 51.5074,
  lng: -0.1278
};

// Application State
const state = {
  lat: DEFAULT_LOCATION.lat,
  lng: DEFAULT_LOCATION.lng,
  locationName: DEFAULT_LOCATION.name,
  locationDetails: DEFAULT_LOCATION,
  weatherData: null,
  unit: localStorage.getItem('skylume_unit') || 'C',
  savedCities: JSON.parse(localStorage.getItem('skylume_saved_cities') || '[]'),
  activeMapLayer: 'standard',
  map: null,
  mapMarker: null,
  mapWeatherOverlay: null,
  weatherStage: null,
  showMoreDetails: false,
  showSavedDrawer: false
};

/* ==========================================================================
   LIGHTWEIGHT CSS WEATHER EFFECTS ENGINE
   ========================================================================== */
function updateWeatherEffects(iconType) {
  const container = document.getElementById('weather-effects-layer');
  if (!container) return;
  
  if (container.dataset.condition === iconType) return;
  container.dataset.condition = iconType;
  
  container.innerHTML = '';

  if (iconType === 'rain-light' || iconType === 'rain-heavy') {
    container.innerHTML = `<div class="rain-streaks"></div>`;
  } else if (iconType === 'drizzle') {
    container.innerHTML = `<div class="drizzle-streaks"></div>`;
  } else if (iconType === 'thunderstorm') {
    container.innerHTML = `<div class="rain-streaks"></div><div class="lightning-flash"></div>`;
  } else if (iconType.includes('cloud') || iconType === 'fog') {
    container.innerHTML = `
      <div class="drifting-cloud cloud-1"></div>
      <div class="drifting-cloud cloud-2"></div>
      <div class="drifting-cloud cloud-3"></div>
    `;
  }
}

/* ==========================================================================
   WMO WEATHER CODE MAPPER & SVG ICONS
   ========================================================================== */
function mapWeatherCode(code, isDay = 1) {
  const codes = {
    0: { label: 'Clear Sky', icon: 'sun' },
    1: { label: 'Mainly Clear', icon: 'sun-cloud' },
    2: { label: 'Partly Cloudy', icon: 'cloud' },
    3: { label: 'Overcast', icon: 'cloud-cloud' },
    45: { label: 'Foggy', icon: 'fog' },
    48: { label: 'Depositing Rime Fog', icon: 'fog' },
    51: { label: 'Light Drizzle', icon: 'drizzle' },
    53: { label: 'Moderate Drizzle', icon: 'drizzle' },
    55: { label: 'Dense Drizzle', icon: 'drizzle' },
    56: { label: 'Freezing Drizzle', icon: 'drizzle' },
    57: { label: 'Dense Freezing Drizzle', icon: 'drizzle' },
    61: { label: 'Slight Rain', icon: 'rain-light' },
    63: { label: 'Moderate Rain', icon: 'rain-heavy' },
    65: { label: 'Heavy Rain', icon: 'rain-heavy' },
    66: { label: 'Freezing Rain', icon: 'rain-heavy' },
    67: { label: 'Heavy Freezing Rain', icon: 'rain-heavy' },
    71: { label: 'Slight Snowfall', icon: 'snow' },
    73: { label: 'Moderate Snowfall', icon: 'snow' },
    75: { label: 'Heavy Snowfall', icon: 'snow' },
    77: { label: 'Snow Grains', icon: 'snow' },
    80: { label: 'Slight Rain Showers', icon: 'rain-light' },
    81: { label: 'Moderate Rain Showers', icon: 'rain-heavy' },
    82: { label: 'Violent Rain Showers', icon: 'thunderstorm' },
    85: { label: 'Slight Snow Showers', icon: 'snow' },
    86: { label: 'Heavy Snow Showers', icon: 'snow' },
    95: { label: 'Thunderstorm', icon: 'thunderstorm' },
    96: { label: 'Thunderstorm with Hail', icon: 'thunderstorm' },
    99: { label: 'Heavy Thunderstorm', icon: 'thunderstorm' }
  };

  const item = codes[code] || { label: 'Clear Sky', icon: 'sun' };
  if (!isDay && item.icon === 'sun') {
    item.icon = 'moon';
  }
  return item;
}

function getMonochromeSvgIcon(iconType, size = 24) {
  const stroke = "currentColor";
  const sw = "2";

  switch (iconType) {
    case 'sun':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    case 'moon':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    case 'sun-cloud':
    case 'cloud':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
    case 'cloud-cloud':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path><path d="M20 6h-1A6 6 0 0 0 7 12"></path></svg>`;
    case 'fog':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="16" x2="20" y2="16"></line></svg>`;
    case 'drizzle':
    case 'rain-light':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`;
    case 'rain-heavy':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M16 14v6M8 14v6M12 16v6M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`;
    case 'snow':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="16" y1="16" x2="16.01" y2="16"></line></svg>`;
    case 'thunderstorm':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><polyline points="13 11 9 17 15 17 11 23"></polyline></svg>`;
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle></svg>`;
  }
}

function formatTemp(celsius) {
  if (state.unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

function showAlert(message) {
  const banner = document.getElementById('alert-banner');
  const msgEl = document.getElementById('alert-message');
  msgEl.textContent = message;
  banner.classList.remove('hidden');
}

function hideAlert() {
  document.getElementById('alert-banner').classList.add('hidden');
}

/* ==========================================================================
   API FETCHING & RENDERERS
   ========================================================================== */
async function fetchWeather(lat, lng, locDetails) {
  hideAlert();
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,is_day,dew_point_2m,cloud_cover&hourly=temperature_2m,weather_code,precipitation_probability,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to retrieve meteorological data.');
    const data = await res.json();

    state.lat = lat;
    state.lng = lng;
    if (locDetails) {
      state.locationDetails = locDetails;
      state.locationName = [locDetails.name, locDetails.admin1, locDetails.country].filter(Boolean).join(', ');
    }
    state.weatherData = data;

    // Normalize current weather object (Single Source of Truth)
    const current = data.current;
    state.currentWeather = {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      weatherCode: current.weather_code,
      precipitation: current.precipitation,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      cloudCover: current.cloud_cover,
      isDay: current.is_day,
      pressure: current.pressure_msl,
      dewPoint: current.dew_point_2m
    };

    renderAll();
    updateMap();

  } catch (err) {
    console.error('Fetch weather error:', err);
    showAlert(`Couldn't retrieve weather data. ${err.message}`);
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`, {
      headers: { 'User-Agent': 'SkyLumeApp/1.0' }
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const name = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state || 'Map Point';
      const country = addr.country || '';
      const admin1 = addr.state || addr.region || '';
      return { lat, lng, name, country, admin1 };
    }
  } catch (e) {
    console.error('Reverse geocode error:', e);
  }
  return { lat, lng, name: `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`, country: '', admin1: '' };
}

// Render Hero Section
function renderHero() {
  if (!state.weatherData || !state.currentWeather) return;
  const current = state.currentWeather;
  const daily = state.weatherData.daily;

  const tempVal = formatTemp(current.temperature);
  const feelsVal = formatTemp(current.feelsLike);
  const highVal = formatTemp(daily.temperature_2m_max[0]);
  const lowVal = formatTemp(daily.temperature_2m_min[0]);

  const mapped = mapWeatherCode(current.weatherCode, current.isDay);

  document.getElementById('hero-location').textContent = state.locationName;
  document.getElementById('hero-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  document.getElementById('hero-temp').textContent = tempVal;
  document.getElementById('hero-feels').textContent = `${feelsVal}°`;
  document.getElementById('hero-high').textContent = `${highVal}°`;
  document.getElementById('hero-low').textContent = `${lowVal}°`;

  const condEl = document.getElementById('hero-condition');
  condEl.textContent = mapped.label;
  condEl.className = 'condition-title';

  if (mapped.icon.includes('rain') || mapped.icon === 'drizzle') {
    condEl.classList.add('cond-color-rain');
  } else if (mapped.icon === 'thunderstorm') {
    condEl.classList.add('cond-color-thunder');
  } else if (mapped.icon.includes('cloud') || mapped.icon === 'fog') {
    condEl.classList.add('cond-color-cloudy');
  }

  const maxRainProb = daily.precipitation_probability_max?.[0] || 0;
  let summaryText = `${mapped.label} today with temperatures reaching up to ${highVal}°.`;
  if (maxRainProb > 30) {
    summaryText = `${mapped.label} right now. Expect a ${maxRainProb}% chance of precipitation later today.`;
  }
  document.getElementById('hero-summary').textContent = summaryText;

  document.getElementById('hero-condition-icon').innerHTML = getMonochromeSvgIcon(mapped.icon, 36);

  // Update Dynamic Weather Stage Engine
  updateWeatherEffects(mapped.icon);

  // Update Save City Button State
  const isSaved = state.savedCities.some(c => c.name.toLowerCase() === state.locationDetails?.name?.toLowerCase());
  const saveBtn = document.getElementById('save-city-btn');
  const saveLabel = document.getElementById('save-city-label');

  if (isSaved) {
    saveBtn.classList.add('saved');
    saveLabel.textContent = 'Saved';
  } else {
    saveBtn.classList.remove('saved');
    saveLabel.textContent = 'Save City';
  }
}

// Render Compact Hourly Forecast Timeline
function renderHourly() {
  if (!state.weatherData || !state.currentWeather) return;
  const container = document.getElementById('hourly-strip');
  container.innerHTML = '';

  const current = state.currentWeather;
  const hourly = state.weatherData.hourly;
  const now = new Date();
  const currentHourIso = new Date(now.setMinutes(0, 0, 0)).toISOString().slice(0, 13);

  let startIdx = hourly.time.findIndex(t => t.startsWith(currentHourIso));
  if (startIdx === -1) startIdx = 0;

  const next24 = hourly.time.slice(startIdx, startIdx + 24);

  next24.forEach((timeStr, idx) => {
    const realIdx = startIdx + idx;
    const dateObj = new Date(timeStr);
    
    const isNow = idx === 0;
    const hourLabel = isNow ? 'NOW' : dateObj.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
    const tempVal = isNow ? formatTemp(current.temperature) : formatTemp(hourly.temperature_2m[realIdx]);
    const mapped = isNow ? mapWeatherCode(current.weatherCode, current.isDay) : mapWeatherCode(hourly.weather_code[realIdx], 1);
    
    let rainProbText = '';
    if (isNow) {
      if (current.precipitation > 0) {
        const prob = hourly.precipitation_probability[realIdx] || 0;
        rainProbText = prob > 0 ? prob + '%' : 'Rain';
      } else {
        rainProbText = '0%'; // Correctly dry right now
      }
    } else {
      const prob = hourly.precipitation_probability[realIdx] || 0;
      rainProbText = prob > 0 ? prob + '%' : '';
    }

    const item = document.createElement('div');
    item.className = `hourly-item ${isNow ? 'now-card' : ''}`;
    item.innerHTML = `
      <span class="hour-time">${hourLabel}</span>
      <div class="hour-icon">${getMonochromeSvgIcon(mapped.icon, 20)}</div>
      <span class="hour-temp">${tempVal}°</span>
      <span class="hour-precip">${rainProbText}</span>
    `;
    container.appendChild(item);
  });
}

// Render 7-Day Forecast
function renderWeekly() {
  if (!state.weatherData) return;
  const container = document.getElementById('weekly-list');
  container.innerHTML = '';

  const daily = state.weatherData.daily;
  const days = daily.time;

  let allLows = daily.temperature_2m_min.map(t => formatTemp(t));
  let allHighs = daily.temperature_2m_max.map(t => formatTemp(t));
  const minTemp = Math.min(...allLows);
  const maxTemp = Math.max(...allHighs);
  const tempRange = maxTemp - minTemp || 1;

  days.forEach((dateStr, idx) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const mapped = mapWeatherCode(daily.weather_code[idx], 1);

    const low = allLows[idx];
    const high = allHighs[idx];
    const rainProb = daily.precipitation_probability_max[idx] || 0;

    const leftPercent = Math.max(0, Math.min(100, ((low - minTemp) / tempRange) * 100));
    const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((high - low) / tempRange) * 100));

    const row = document.createElement('div');
    row.className = 'weekly-row';
    row.innerHTML = `
      <span class="weekly-day ${idx === 0 ? 'is-today' : ''}">${dayName}</span>
      <div class="weekly-icon">${getMonochromeSvgIcon(mapped.icon, 18)}</div>
      <span class="weekly-cond">${mapped.label}</span>
      <div class="weekly-spectrum">
        <span class="spectrum-temp low">${low}°</span>
        <div class="spectrum-bar-track">
          <div class="spectrum-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
        </div>
        <span class="spectrum-temp high">${high}°</span>
      </div>
      <span class="weekly-rain">${rainProb > 0 ? rainProb + '%' : ''}</span>
    `;
    container.appendChild(row);
  });
}

// Render Saved Cities Drawer
function renderSavedCities() {
  const container = document.getElementById('saved-chips-container');
  const countBadge = document.getElementById('saved-count-badge');
  container.innerHTML = '';
  countBadge.textContent = state.savedCities.length;

  if (state.savedCities.length === 0) {
    container.innerHTML = `<span class="empty-saved-msg">No saved locations yet. Click "Save City" in the weather section.</span>`;
    return;
  }

  state.savedCities.forEach(city => {
    const isActive = city.name.toLowerCase() === state.locationDetails?.name?.toLowerCase();
    const chip = document.createElement('div');
    chip.className = `saved-chip ${isActive ? 'active-city' : ''}`;
    chip.innerHTML = `
      <div>
        <span class="chip-name">${city.name}</span>
      </div>
      <div>
        <span class="chip-temp-val">${city.temp != null ? formatTemp(city.temp) + '°' : ''}</span>
        <button type="button" class="chip-remove" aria-label="Remove city">✕</button>
      </div>
    `;

    chip.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip-remove')) {
        e.stopPropagation();
        state.savedCities = state.savedCities.filter(c => c.name.toLowerCase() !== city.name.toLowerCase());
        localStorage.setItem('skylume_saved_cities', JSON.stringify(state.savedCities));
        renderSavedCities();
        renderHero();
        return;
      }
      document.getElementById('saved-cities-drawer').classList.add('hidden');
      state.showSavedDrawer = false;
      fetchWeather(city.lat, city.lng, city);
    });

    container.appendChild(chip);
  });
}

// Render Compact Collapsible Details
function renderDetails() {
  if (!state.weatherData || !state.currentWeather) return;
  const current = state.currentWeather;
  const daily = state.weatherData.daily;
  const hourly = state.weatherData.hourly;

  const now = new Date();
  const isoHour = new Date(now.setMinutes(0, 0, 0)).toISOString().slice(0, 13) + ':00';
  let uvIndex = 0;
  let visibility = 10000;

  const hIdx = hourly.time.findIndex(t => t.startsWith(isoHour.slice(0, 13)));
  if (hIdx !== -1) {
    uvIndex = hourly.uv_index[hIdx] || 0;
    visibility = hourly.visibility[hIdx] || 10000;
  }

  document.getElementById('metric-humidity').textContent = `${Math.round(current.humidity)}%`;

  const windSpeed = state.unit === 'F' ? Math.round(current.windSpeed * 0.621371) : Math.round(current.windSpeed);
  const windUnit = state.unit === 'F' ? 'mph' : 'km/h';
  document.getElementById('metric-wind').textContent = `${windSpeed} ${windUnit}`;
  document.getElementById('metric-wind-sub').textContent = `Direction ${current.windDirection}°`;

  const roundedUv = Math.round(uvIndex);
  const uvEl = document.getElementById('metric-uv');
  uvEl.textContent = `${roundedUv}`;
  if (roundedUv >= 7) uvEl.classList.add('metric-high-uv');
  else uvEl.classList.remove('metric-high-uv');

  const visVal = state.unit === 'F' ? Math.round((visibility / 1000) * 0.621371) : Math.round(visibility / 1000);
  const visUnit = state.unit === 'F' ? 'mi' : 'km';
  document.getElementById('metric-vis').textContent = `${visVal} ${visUnit}`;

  const maxRainProb = daily.precipitation_probability_max?.[0] || 0;
  document.getElementById('metric-rain').textContent = `${maxRainProb}%`;
  document.getElementById('metric-pressure').textContent = `${Math.round(current.pressure)} hPa`;
  document.getElementById('metric-dew').textContent = `${formatTemp(current.dewPoint)}°`;
  document.getElementById('metric-cloud').textContent = `${Math.round(current.cloudCover)}%`;

  if (daily.sunrise?.[0] && daily.sunset?.[0]) {
    const sunriseObj = new Date(daily.sunrise[0]);
    const sunsetObj = new Date(daily.sunset[0]);
    document.getElementById('solar-sunrise').textContent = sunriseObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    document.getElementById('solar-sunset').textContent = sunsetObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    const totalDay = sunsetObj - sunriseObj;
    const elapsed = new Date() - sunriseObj;
    let pct = (elapsed / totalDay) * 100;
    pct = Math.max(0, Math.min(100, pct));
    document.getElementById('solar-arc-fill').style.width = `${pct}%`;
  }
}

function renderAll() {
  renderHero();
  renderHourly();
  renderWeekly();
  renderSavedCities();
  renderDetails();
}

/* ==========================================================================
   LEAFLET MAP INTEGRATION
   ========================================================================== */
function initMap() {
  if (state.map) return;

  state.map = L.map('map', {
    center: [state.lat, state.lng],
    zoom: 10,
    zoomControl: false
  });

  L.control.zoom({ position: 'topright' }).addTo(state.map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(state.map);

  state.mapMarker = L.marker([state.lat, state.lng]).addTo(state.map);

  state.map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    const details = await reverseGeocode(lat, lng);
    fetchWeather(lat, lng, details);
  });
}

function updateMap() {
  if (!state.map) {
    initMap();
  }
  if (state.map) {
    state.map.flyTo([state.lat, state.lng], 10, { duration: 1.2 });
    if (state.mapMarker) {
      state.mapMarker.setLatLng([state.lat, state.lng]);
    }
  }
}

/* ==========================================================================
   SEARCH & AUTOCOMPLETE
   ========================================================================== */
let searchDebounceTimer = null;

async function searchCities(query) {
  if (!query || query.trim().length < 2) {
    document.getElementById('search-dropdown').classList.add('hidden');
    return;
  }
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    if (res.ok) {
      const data = await res.json();
      renderSearchDropdown(data.results || []);
    }
  } catch (e) {
    console.error('City search error:', e);
  }
}

function renderSearchDropdown(results) {
  const dropdown = document.getElementById('search-dropdown');
  dropdown.innerHTML = '';

  if (results.length === 0) {
    dropdown.classList.add('hidden');
    return;
  }

  results.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'search-item';
    li.innerHTML = `
      <span class="search-item-title">${item.name}</span>
      <span class="search-item-sub">${[item.admin1, item.country].filter(Boolean).join(', ')}</span>
    `;

    li.addEventListener('click', () => {
      document.getElementById('search-input').value = '';
      document.getElementById('search-clear-btn').classList.add('hidden');
      dropdown.classList.add('hidden');
      fetchWeather(item.latitude, item.longitude, {
        name: item.name,
        country: item.country || '',
        admin1: item.admin1 || '',
        lat: item.latitude,
        lng: item.longitude
      });
    });

    dropdown.appendChild(li);
  });

  dropdown.classList.remove('hidden');
}

/* ==========================================================================
   INITIALIZATION & EVENT LISTENERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // Search Input Listeners
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.length > 0) {
      searchClearBtn.classList.remove('hidden');
    } else {
      searchClearBtn.classList.add('hidden');
    }

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      searchCities(val);
    }, 300);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = searchInput.value.trim();
      if (val) {
        clearTimeout(searchDebounceTimer);
        searchCities(val);
      }
    }
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchClearBtn.classList.add('hidden');
    document.getElementById('search-dropdown').classList.add('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      document.getElementById('search-dropdown').classList.add('hidden');
    }
    if (!e.target.closest('.saved-cities-drawer') && !e.target.closest('#saved-cities-toggle-btn')) {
      document.getElementById('saved-cities-drawer').classList.add('hidden');
      state.showSavedDrawer = false;
    }
  });

  // Header Buttons
  document.getElementById('brand-logo').addEventListener('click', () => {
    location.reload();
  });

  document.getElementById('my-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const details = await reverseGeocode(lat, lng);
          fetchWeather(lat, lng, details);
        },
        () => {
          showAlert('Geolocation access denied. Showing default location (London).');
          fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, DEFAULT_LOCATION);
        }
      );
    }
  });

  // Saved Cities Drawer Toggle
  document.getElementById('saved-cities-toggle-btn').addEventListener('click', () => {
    state.showSavedDrawer = !state.showSavedDrawer;
    const drawer = document.getElementById('saved-cities-drawer');
    if (state.showSavedDrawer) {
      drawer.classList.remove('hidden');
    } else {
      drawer.classList.add('hidden');
    }
  });

  document.getElementById('close-saved-drawer-btn').addEventListener('click', () => {
    document.getElementById('saved-cities-drawer').classList.add('hidden');
    state.showSavedDrawer = false;
  });

  // Unit Toggle (°C / °F)
  document.getElementById('unit-toggle-btn').addEventListener('click', () => {
    state.unit = state.unit === 'C' ? 'F' : 'C';
    localStorage.setItem('skylume_unit', state.unit);

    document.getElementById('unit-c').classList.toggle('active', state.unit === 'C');
    document.getElementById('unit-f').classList.toggle('active', state.unit === 'F');

    renderAll();
  });

  // Dismiss Alert
  document.getElementById('alert-dismiss-btn').addEventListener('click', hideAlert);

  // Save City Button
  document.getElementById('save-city-btn').addEventListener('click', () => {
    if (!state.locationDetails) return;
    const name = state.locationDetails.name;
    const existsIdx = state.savedCities.findIndex(c => c.name.toLowerCase() === name.toLowerCase());

    if (existsIdx !== -1) {
      state.savedCities.splice(existsIdx, 1);
    } else {
      state.savedCities.push({
        name: state.locationDetails.name,
        country: state.locationDetails.country,
        admin1: state.locationDetails.admin1,
        lat: state.lat,
        lng: state.lng,
        temp: state.weatherData?.current?.temperature_2m
      });
    }

    localStorage.setItem('skylume_saved_cities', JSON.stringify(state.savedCities));
    renderHero();
    renderSavedCities();
  });

  // Hourly Navigation Buttons
  const hourlyStrip = document.getElementById('hourly-strip');
  document.getElementById('hourly-left-btn').addEventListener('click', () => {
    hourlyStrip.scrollBy({ left: -220, behavior: 'smooth' });
  });
  document.getElementById('hourly-right-btn').addEventListener('click', () => {
    hourlyStrip.scrollBy({ left: 220, behavior: 'smooth' });
  });

  // Map Layer Toggles
  document.querySelectorAll('.layer-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.layer-chip').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.activeMapLayer = e.target.dataset.layer;
    });
  });

  // Toggle Collapsible Details
  document.getElementById('toggle-more-details-btn').addEventListener('click', () => {
    state.showMoreDetails = !state.showMoreDetails;
    const drawer = document.getElementById('secondary-details-drawer');
    const text = document.getElementById('details-toggle-text');
    const arrow = document.getElementById('details-toggle-arrow');

    if (state.showMoreDetails) {
      drawer.classList.remove('hidden');
      text.textContent = 'Fewer details';
      arrow.textContent = '↑';
    } else {
      drawer.classList.add('hidden');
      text.textContent = 'More details';
      arrow.textContent = '↓';
    }
  });

  // Initial Load: Geolocation or Default Fallback
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const details = await reverseGeocode(lat, lng);
        fetchWeather(lat, lng, details);
      },
      () => {
        fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, DEFAULT_LOCATION);
      }
    );
  } else {
    fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, DEFAULT_LOCATION);
  }
});
