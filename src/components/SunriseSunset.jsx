import React, { useEffect, useRef } from 'react';
import { Sunrise, Sunset } from 'lucide-react';

export default function SunriseSunset({ sunriseStr, sunsetStr, isDay }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 85;

    const drawCurve = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const margin = 20;
      const width = canvas.width - margin * 2;
      const centerY = canvas.height - 14;

      // Horizon Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(8, centerY);
      ctx.lineTo(canvas.width - 8, centerY);
      ctx.stroke();

      // Dotted Arc
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = isDay ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      for (let x = margin; x <= margin + width; x++) {
        const t = (x - margin) / width;
        const y = centerY - Math.sin(t * Math.PI) * 50;
        if (x === margin) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Sun/Moon position calculation
      let fraction = 0.5;
      let showSun = false;

      if (sunriseStr && sunsetStr) {
        try {
          const now = new Date();
          const [sunH, sunM] = sunriseStr.split(':').map(Number);
          const [setH, setM] = sunsetStr.split(':').map(Number);
          
          const sunriseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sunH, sunM);
          const sunsetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), setH, setM);

          if (now >= sunriseTime && now <= sunsetTime) {
            fraction = (now - sunriseTime) / (sunsetTime - sunriseTime);
            showSun = true;
          }
        } catch (e) {
          console.error('Error parsing sun times', e);
        }
      }

      // Marker
      ctx.save();
      const sunT = showSun ? fraction : 0.5;
      const sunX = margin + sunT * width;
      const sunY = centerY - Math.sin(sunT * Math.PI) * 50;

      if (showSun && isDay) {
        ctx.fillStyle = 'rgba(253, 224, 71, 0.08)';
        ctx.beginPath();
        ctx.moveTo(margin, centerY);
        for (let x = margin; x <= sunX; x++) {
          const t = (x - margin) / width;
          const y = centerY - Math.sin(t * Math.PI) * 50;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(sunX, centerY);
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    drawCurve();
  }, [sunriseStr, sunsetStr, isDay]);

  return (
    <div className="glass-panel sunrise-panel">
      <h3 className="sunrise-title">Sunrise / Sunset</h3>

      <div className="sun-arc-container">
        <canvas ref={canvasRef} className="sun-arc-canvas" />
      </div>

      <div className="sunrise-times-row">
        <div className="sun-time-block">
          <Sunrise size={16} style={{ color: '#f59e0b' }} />
          <div className="sun-time-details">
            <span className="sun-label">Sunrise</span>
            <span className="sun-val">{sunriseStr || '--:--'}</span>
          </div>
        </div>

        <div className="sun-time-block">
          <Sunset size={16} style={{ color: '#818cf8' }} />
          <div className="sun-time-details">
            <span className="sun-label">Sunset</span>
            <span className="sun-val">{sunsetStr || '--:--'}</span>
          </div>
        </div>
      </div>

      <style>{`
        .sunrise-panel {
          padding: 18px 24px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          min-height: 200px;
        }
        .sunrise-title {
          align-self: flex-start;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }
        .sun-arc-container {
          position: relative;
          width: 100%;
          max-width: 280px;
          display: flex;
          justify-content: center;
          margin: 2px 0;
        }
        .sun-arc-canvas {
          width: 100%;
          max-width: 280px;
          height: 85px;
        }
        .sunrise-times-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--card-border);
          padding-top: 10px;
        }
        .sun-time-block {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sun-time-details {
          display: flex;
          flex-direction: column;
        }
        .sun-label {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 600;
        }
        .sun-val {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
