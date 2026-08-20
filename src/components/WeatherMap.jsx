import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, MapPin, Check } from 'lucide-react';
import MapControls from './MapControls';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  return `${celsius}°C`;
};

export default function WeatherMap({
  location,
  weatherData,
  onMapClick,
  isSaved = false,
  onToggleSave,
  unit = 'C',
  theme = 'dark'
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const weatherLayerRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const onMapClickRef = useRef(onMapClick);
  const onToggleSaveRef = useRef(onToggleSave);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    onToggleSaveRef.current = onToggleSave;
  }, [onToggleSave]);

  const [activeLayer, setActiveLayer] = useState('standard');

  // Initialize Map safely & lock scroll jump triggers
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (mapRef.current || container._leaflet_id) {
      return;
    }

    const map = L.map(container, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: 'center',
      keyboard: false
    }).setView([location.lat, location.lng], 7);

    mapRef.current = map;

    container.addEventListener(
      'focusin',
      (e) => {
        e.preventDefault();
      },
      true
    );

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (onMapClickRef.current) {
        onMapClickRef.current(lat, lng);
      }
    });

    // Delegate popup button clicks
    const handlePopupClick = (e) => {
      const saveBtn = e.target.closest('#map-popup-save-btn');
      if (saveBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleSaveRef.current) {
          onToggleSaveRef.current();
        }
      }
    };

    container.addEventListener('click', handlePopupClick);

    return () => {
      container.removeEventListener('click', handlePopupClick);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (container) {
        delete container._leaflet_id;
      }
    };
  }, []);

  // Base Tile Layer with Fallback (CartoDB Dark in dark mode, CartoDB Voyager in bright mode)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const isLight = theme === 'light';
    const primaryUrl = isLight
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const fallbackUrl = isLight
      ? 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
      : 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

    const tileLayer = L.tileLayer(primaryUrl, {
      attribution,
      maxZoom: 19,
      subdomains: 'abcd'
    });

    tileLayer.on('tileerror', () => {
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(fallbackUrl);
      }
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;
  }, [theme]);

  // Custom DivIcon Marker & Smooth FlyTo (without autoPan scroll jump)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const latlng = [location.lat, location.lng];

    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
      map.flyTo(latlng, map.getZoom(), { animate: true, duration: 1.2 });
    } else {
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="marker-pulse"></div>
          <div class="marker-pin-outer">
            <div class="marker-pin-inner"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      markerRef.current = L.marker(latlng, { icon: customIcon }).addTo(map);
    }

    const currentTempStr =
      weatherData?.current?.temperature !== undefined
        ? formatTemp(weatherData.current.temperature, unit)
        : '';

    const saveBtnHtml = `
      <button 
        id="map-popup-save-btn" 
        class="map-popup-save-btn ${isSaved ? 'is-saved' : ''}" 
        type="button"
        title="${isSaved ? 'Remove from saved cities' : 'Save to saved cities'}"
      >
        <span class="star-icon">${isSaved ? '★' : '☆'}</span>
        <span>${isSaved ? 'Saved to Cities' : 'Save this City'}</span>
      </button>
    `;

    markerRef.current
      .bindPopup(
        `
      <div style="font-weight: 600; font-family: var(--font-sans); padding: 4px 4px 2px 4px; min-width: 150px;">
        <div style="color: var(--accent-primary); font-size: 13px; font-weight: 700; line-height: 1.2;">
          ${location.name} ${currentTempStr ? `(${currentTempStr})` : ''}
        </div>
        <div style="color: var(--text-secondary); font-size: 11px; margin-top: 2px; margin-bottom: 8px;">
          ${location.admin1 ? location.admin1 + ', ' : ''}${location.country || ''}
        </div>
        ${saveBtnHtml}
      </div>
    `,
        { autoPan: false }
      )
      .openPopup();
  }, [location, weatherData, unit, isSaved]);

  // RainViewer Radar & Satellite Infrared Overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (weatherLayerRef.current) {
      map.removeLayer(weatherLayerRef.current);
      weatherLayerRef.current = null;
    }

    if (
      activeLayer === 'standard' ||
      activeLayer === 'wind' ||
      activeLayer === 'temp'
    ) {
      return;
    }

    const fetchRainViewerOverlay = async () => {
      try {
        const res = await fetch(
          'https://api.rainviewer.com/public/weather-maps.json'
        );
        if (!res.ok) return;
        const data = await res.json();

        const host = data.host;
        let path = '';

        if (activeLayer === 'precipitation' && data.radar?.past?.length > 0) {
          path = data.radar.past[data.radar.past.length - 1].path;
        } else if (
          activeLayer === 'clouds' &&
          data.satellite?.infrared?.length > 0
        ) {
          path = data.satellite.infrared[data.satellite.infrared.length - 1].path;
        }

        if (path && host) {
          const overlayUrl = `${host}${path}/256/{z}/{x}/{y}/2/1_1.png`;
          weatherLayerRef.current = L.tileLayer(overlayUrl, {
            opacity: activeLayer === 'precipitation' ? 0.75 : 0.55,
            attribution:
              'Tiles by <a href="https://www.rainviewer.com/">RainViewer</a>'
          }).addTo(map);
        }
      } catch (err) {
        console.error('RainViewer overlay error:', err);
      }
    };

    fetchRainViewerOverlay();
  }, [activeLayer]);

  // Canvas Overlay for Wind & Temperature Layers
  useEffect(() => {
    const map = mapRef.current;
    const canvas = overlayCanvasRef.current;
    if (!map || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
    };
    resizeCanvas();

    let particles = [];
    const maxParticles = 60;

    const windSpeed = weatherData?.current?.windSpeed || 10;
    const windDirection = weatherData?.current?.windDirection || 0;
    const temperature = weatherData?.current?.temperature || 20;

    if (activeLayer === 'wind') {
      const rad = (windDirection - 90) * (Math.PI / 180);
      const baseSpeed = Math.max(windSpeed / 6, 1.2);
      const vx = Math.cos(rad) * baseSpeed;
      const vy = Math.sin(rad) * baseSpeed;

      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx,
          vy,
          length: Math.random() * 18 + 8,
          opacity: Math.random() * 0.45 + 0.15
        });
      }
    }

    const drawOverlay = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeLayer === 'temp') {
        const centerLatLng = L.latLng(location.lat, location.lng);
        const centerPoint = map.latLngToContainerPoint(centerLatLng);

        let colorStop1 = 'rgba(239, 68, 68, 0.45)';
        let colorStop2 = 'rgba(239, 68, 68, 0)';

        if (temperature <= 0) {
          colorStop1 = 'rgba(14, 165, 233, 0.45)';
          colorStop2 = 'rgba(14, 165, 233, 0)';
        } else if (temperature <= 15) {
          colorStop1 = 'rgba(45, 212, 191, 0.45)';
          colorStop2 = 'rgba(45, 212, 191, 0)';
        } else if (temperature <= 25) {
          colorStop1 = 'rgba(234, 179, 8, 0.45)';
          colorStop2 = 'rgba(234, 179, 8, 0)';
        }

        const baseRadius = 180;
        const pulse = Math.sin(Date.now() / 600) * 15;
        const radius = Math.max(baseRadius + pulse, 50);

        const gradient = ctx.createRadialGradient(
          centerPoint.x,
          centerPoint.y,
          5,
          centerPoint.x,
          centerPoint.y,
          radius
        );
        gradient.addColorStop(0, colorStop1);
        gradient.addColorStop(0.5, colorStop1.replace('0.45', '0.15'));
        gradient.addColorStop(1, colorStop2);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = 'rgba(15, 25, 45, 0.9)';
        ctx.beginPath();
        ctx.roundRect(centerPoint.x - 36, centerPoint.y - 48, 72, 26, 8);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px var(--font-sans)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          formatTemp(temperature, unit),
          centerPoint.x,
          centerPoint.y - 35
        );
      } else if (activeLayer === 'wind') {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        particles.forEach((p) => {
          ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
          ctx.stroke();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        });
      }

      animationFrameId = requestAnimationFrame(drawOverlay);
    };

    if (activeLayer === 'temp' || activeLayer === 'wind') {
      drawOverlay();
      map.on('move moveend zoom zoomend resize', resizeCanvas);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      map.off('move moveend zoom zoomend resize', resizeCanvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [activeLayer, location, weatherData, unit]);

  const currentTempStr =
    weatherData?.current?.temperature !== undefined
      ? formatTemp(weatherData.current.temperature, unit)
      : '';

  return (
    <div className="weather-map-wrapper sk-panel">
      <div ref={mapContainerRef} className="map-container-element" />

      {(activeLayer === 'wind' || activeLayer === 'temp') && (
        <canvas ref={overlayCanvasRef} className="map-overlay-canvas" />
      )}

      {/* Interactive Map HUD Overlay for Location & Save Action */}
      <div className="map-hud-pin-bar">
        <div className="map-hud-location">
          <MapPin size={13} className="map-hud-icon" />
          <span className="map-hud-title">{location.name}</span>
          {currentTempStr && (
            <span className="map-hud-temp">{currentTempStr}</span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleSave}
          className={`map-hud-save-btn ${isSaved ? 'is-saved' : ''}`}
          title={isSaved ? 'Remove from saved cities' : 'Save this city to favorites'}
        >
          {isSaved ? (
            <>
              <Check size={12} className="save-check-icon" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Star size={12} />
              <span>Save Place</span>
            </>
          )}
        </button>
      </div>

      <MapControls activeLayer={activeLayer} onChangeLayer={setActiveLayer} />

      <style>{`
        .weather-map-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 420px;
          border-radius: var(--card-radius);
          overflow: hidden;
        }
        .map-container-element {
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .map-overlay-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 400;
        }

        /* Floating HUD Pin Bar */
        .map-hud-pin-bar {
          position: absolute;
          bottom: 16px;
          left: 16px;
          z-index: 500;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 24px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-medium);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          max-width: calc(100% - 32px);
        }

        [data-theme="light"] .map-hud-pin-bar {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .map-hud-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .map-hud-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .map-hud-title {
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .map-hud-temp {
          font-family: var(--font-display);
          color: var(--accent-primary);
          font-weight: 700;
          font-size: 13px;
        }

        .map-hud-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid rgba(56, 189, 248, 0.35);
          background: rgba(56, 189, 248, 0.12);
          color: var(--accent-primary);
          transition: var(--transition-fast);
          flex-shrink: 0;
        }

        .map-hud-save-btn:hover {
          background: rgba(56, 189, 248, 0.25);
          border-color: rgba(56, 189, 248, 0.6);
          transform: scale(1.03);
        }

        .map-hud-save-btn.is-saved {
          background: rgba(245, 158, 11, 0.18);
          border-color: rgba(245, 158, 11, 0.5);
          color: var(--accent-amber);
        }

        .map-hud-save-btn.is-saved:hover {
          background: rgba(245, 158, 11, 0.28);
        }

        .save-check-icon {
          color: var(--accent-amber);
        }

        /* Popup save button styling */
        .map-popup-save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          margin-top: 6px;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid rgba(56, 189, 248, 0.4);
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          transition: all 0.15s ease;
        }

        .map-popup-save-btn:hover {
          background: rgba(56, 189, 248, 0.3);
          border-color: #38bdf8;
        }

        .map-popup-save-btn.is-saved {
          background: rgba(245, 158, 11, 0.2);
          border-color: rgba(245, 158, 11, 0.6);
          color: #fbbf24;
        }

        .map-popup-save-btn .star-icon {
          font-size: 13px;
          line-height: 1;
        }

        @media (max-width: 1024px) {
          .weather-map-wrapper {
            min-height: 380px;
          }
        }
        @media (max-width: 640px) {
          .weather-map-wrapper {
            min-height: 320px;
          }
          .map-hud-pin-bar {
            bottom: 12px;
            left: 12px;
            padding: 6px 10px;
          }
        }
      `}</style>
    </div>
  );
}
