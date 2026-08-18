import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapControls from './MapControls';

const formatTemp = (celsius, unit) => {
  if (unit === 'F') return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  return `${celsius}°C`;
};

export default function WeatherMap({ location, weatherData, onMapClick, unit = 'C' }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const weatherLayerRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

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

    container.addEventListener('focusin', (e) => {
      e.preventDefault();
    }, true);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (onMapClickRef.current) {
        onMapClickRef.current(lat, lng);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (container) {
        delete container._leaflet_id;
      }
    };
  }, []);

  // Base Tile Layer with Fallback (CartoDB Dark -> OpenStreetMap)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const primaryUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const fallbackUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

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
  }, []);

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

    const currentTempStr = weatherData?.current?.temperature !== undefined 
      ? formatTemp(weatherData.current.temperature, unit)
      : '';

    markerRef.current.bindPopup(`
      <div style="font-weight: 600; font-family: var(--font-sans); padding: 2px 4px;">
        <div style="color: var(--accent-color); font-size: 13px; font-weight: 700; line-height: 1.2;">${location.name} ${currentTempStr ? `(${currentTempStr})` : ''}</div>
        <div style="color: var(--text-secondary); font-size: 10px; margin-top: 1px;">
          ${location.admin1 ? location.admin1 + ', ' : ''}${location.country || ''}
        </div>
      </div>
    `, { autoPan: false }).openPopup();

  }, [location, weatherData, unit]);

  // RainViewer Radar & Satellite Infrared Overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (weatherLayerRef.current) {
      map.removeLayer(weatherLayerRef.current);
      weatherLayerRef.current = null;
    }

    if (activeLayer === 'standard' || activeLayer === 'wind' || activeLayer === 'temp') {
      return;
    }

    const fetchRainViewerOverlay = async () => {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (!res.ok) return;
        const data = await res.json();
        
        const host = data.host;
        let path = '';

        if (activeLayer === 'precipitation' && data.radar?.past?.length > 0) {
          path = data.radar.past[data.radar.past.length - 1].path;
        } else if (activeLayer === 'clouds' && data.satellite?.infrared?.length > 0) {
          path = data.satellite.infrared[data.satellite.infrared.length - 1].path;
        }

        if (path && host) {
          const overlayUrl = `${host}${path}/256/{z}/{x}/{y}/2/1_1.png`;
          weatherLayerRef.current = L.tileLayer(overlayUrl, {
            opacity: activeLayer === 'precipitation' ? 0.75 : 0.55,
            attribution: 'Tiles by <a href="https://www.rainviewer.com/">RainViewer</a>'
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
          centerPoint.x, centerPoint.y, 5,
          centerPoint.x, centerPoint.y, radius
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
        ctx.fillText(formatTemp(temperature, unit), centerPoint.x, centerPoint.y - 35);
      } 
      
      else if (activeLayer === 'wind') {
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

  return (
    <div className="weather-map-wrapper glass-panel">
      <div 
        ref={mapContainerRef} 
        className="map-container-element"
      />

      {(activeLayer === 'wind' || activeLayer === 'temp') && (
        <canvas
          ref={overlayCanvasRef}
          className="map-overlay-canvas"
        />
      )}

      <MapControls activeLayer={activeLayer} onChangeLayer={setActiveLayer} />

      <style>{`
        .weather-map-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 420px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px var(--shadow-color);
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
        @media (max-width: 1024px) {
          .weather-map-wrapper {
            min-height: 380px;
          }
        }
        @media (max-width: 640px) {
          .weather-map-wrapper {
            min-height: 320px;
          }
        }
      `}</style>
    </div>
  );
}
