import React from 'react';

export default function LoadingState() {
  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* 1. Header Shimmer */}
      <div 
        className="sk-panel shimmer-bg"
        style={{
          height: '60px',
          width: '100%',
          borderRadius: 'var(--card-radius)'
        }}
      />

      {/* 2. Hero Shimmer */}
      <div 
        className="sk-panel shimmer-bg"
        style={{
          height: '240px',
          width: '100%',
          borderRadius: 'var(--card-radius)'
        }}
      />

      {/* 3. Metrics Strip Shimmer */}
      <div 
        className="sk-panel shimmer-bg"
        style={{
          height: '100px',
          width: '100%',
          borderRadius: 'var(--card-radius)'
        }}
      />

      {/* 4. Hourly Forecast Shimmer */}
      <div 
        className="sk-panel shimmer-bg"
        style={{
          height: '180px',
          width: '100%',
          borderRadius: 'var(--card-radius)'
        }}
      />

      {/* 5. 7-Day & Map Layout Shimmer */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '20px',
          width: '100%'
        }}
      >
        <div className="sk-panel shimmer-bg" style={{ height: '360px', borderRadius: 'var(--card-radius)' }} />
        <div className="sk-panel shimmer-bg" style={{ height: '360px', borderRadius: 'var(--card-radius)' }} />
      </div>
    </div>
  );
}
