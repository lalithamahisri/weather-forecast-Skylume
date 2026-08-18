import React from 'react';
import { Layers, Map, Thermometer, CloudRain, Wind, Cloud } from 'lucide-react';

export default function MapControls({ activeLayer, onChangeLayer }) {
  const layers = [
    { id: 'standard', label: 'Standard', icon: Map },
    { id: 'temp', label: 'Temp', icon: Thermometer },
    { id: 'precipitation', label: 'Rain', icon: CloudRain },
    { id: 'wind', label: 'Wind', icon: Wind },
    { id: 'clouds', label: 'Clouds', icon: Cloud }
  ];

  return (
    <div className="map-controls-panel">
      <div className="map-controls-header">
        <Layers size={11} style={{ color: 'var(--accent-color)' }} />
        <span>Layers</span>
      </div>

      <div className="map-controls-list">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChangeLayer(layer.id);
              }}
              className={`layer-btn ${isActive ? 'layer-btn-active' : ''}`}
            >
              <Icon size={12} className="layer-icon" />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .map-controls-panel {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 800;
          padding: 5px 6px;
          border-radius: 12px;
          background: rgba(15, 25, 45, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--card-border);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 110px;
        }
        .map-controls-header {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 2px;
        }
        .map-controls-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .layer-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
          width: 100%;
          text-align: left;
        }
        .layer-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }
        .layer-btn-active {
          background: var(--accent-glow) !important;
          border-color: var(--accent-color) !important;
          color: var(--accent-color) !important;
        }
        @media (max-width: 640px) {
          .map-controls-panel {
            top: auto;
            bottom: 8px;
            right: 8px;
            left: 8px;
            min-width: unset;
            flex-direction: row;
            align-items: center;
          }
          .map-controls-header {
            border-bottom: none;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            padding-right: 6px;
            margin-bottom: 0;
          }
          .map-controls-list {
            flex-direction: row;
            overflow-x: auto;
            gap: 4px;
          }
          .layer-btn {
            padding: 4px 8px;
            font-size: 10px;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
