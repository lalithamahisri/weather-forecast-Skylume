import React from 'react';

export default function LoadingState() {
  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px 40px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* 1. Header Shimmer */}
      <div 
        className="glass-panel shimmer-bg"
        style={{
          height: '64px',
          width: '100%',
          borderRadius: '20px'
        }}
      />

      {/* 2. Content Layout Grid Shimmer */}
      <div 
        className="dashboard-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '24px',
          width: '100%'
        }}
      >
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Weather Hero Shimmer */}
          <div 
            className="glass-panel shimmer-bg"
            style={{
              height: '340px',
              borderRadius: '20px'
            }}
          />

          {/* Hourly Forecast Shimmer */}
          <div 
            className="glass-panel"
            style={{
              padding: '24px',
              height: '210px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div className="shimmer-bg" style={{ height: '14px', width: '120px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '14px', overflow: 'hidden' }}>
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="shimmer-bg"
                  style={{
                    flex: '0 0 76px',
                    height: '130px',
                    borderRadius: '16px'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Daily Forecast Shimmer */}
          <div 
            className="glass-panel"
            style={{
              padding: '24px',
              height: '380px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div className="shimmer-bg" style={{ height: '14px', width: '120px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="shimmer-bg"
                  style={{
                    height: '45px',
                    borderRadius: '12px',
                    width: '100%'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Map Shimmer */}
          <div 
            className="glass-panel shimmer-bg"
            style={{
              height: '420px',
              borderRadius: '20px'
            }}
          />

          {/* Current Weather Card Shimmer */}
          <div 
            className="glass-panel shimmer-bg"
            style={{
              height: '260px',
              borderRadius: '20px'
            }}
          />

          {/* Sunrise Sunset Shimmer */}
          <div 
            className="glass-panel shimmer-bg"
            style={{
              height: '260px',
              borderRadius: '20px'
            }}
          />
        </div>
      </div>

      <style>{`
        .dashboard-layout {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
