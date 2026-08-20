import React, { useEffect, useRef } from 'react';
import { Sunrise, Sunset, Clock } from 'lucide-react';

export default function SunriseSunset({ sunriseStr, sunsetStr, isDay = true }) {
  const canvasRef = useRef(null);

  // Compute daylight duration in hours & minutes
  let daylightDurationStr = '--h --m';
  if (sunriseStr && sunsetStr) {
    try {
      const [sunH, sunM] = sunriseStr.split(':').map(Number);
      const [setH, setM] = sunsetStr.split(':').map(Number);
      let diffMinutes = setH * 60 + setM - (sunH * 60 + sunM);
      if (diffMinutes < 0) diffMinutes += 24 * 60;
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      daylightDurationStr = `${hours}h ${mins}m`;
    } catch (e) {
      console.error('Error calculating daylight duration', e);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 340;
    canvas.height = 100;

    const drawCurve = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const margin = 30;
      const width = canvas.width - margin * 2;
      const centerY = canvas.height - 18;

      // Draw Horizon Base Line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, centerY);
      ctx.lineTo(canvas.width - 10, centerY);
      ctx.stroke();

      // Draw Solar Arc Path (Dashed)
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = isDay ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      for (let x = margin; x <= margin + width; x++) {
        const t = (x - margin) / width;
        const y = centerY - Math.sin(t * Math.PI) * 60;
        if (x === margin) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Calculate position fraction based on actual time vs sunrise / sunset
      let fraction = 0.5;
      let isSunActive = false;

      if (sunriseStr && sunsetStr) {
        try {
          const now = new Date();
          const [sunH, sunM] = sunriseStr.split(':').map(Number);
          const [setH, setM] = sunsetStr.split(':').map(Number);
          
          const sunriseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sunH, sunM);
          const sunsetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), setH, setM);

          if (now >= sunriseTime && now <= sunsetTime) {
            fraction = (now - sunriseTime) / (sunsetTime - sunriseTime);
            isSunActive = true;
          }
        } catch (e) {
          console.error('Error computing solar marker position', e);
        }
      }

      // Fill Area under current position
      const currentX = margin + fraction * width;
      const currentY = centerY - Math.sin(fraction * Math.PI) * 60;

      if (isSunActive && isDay) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
        ctx.beginPath();
        ctx.moveTo(margin, centerY);
        for (let x = margin; x <= currentX; x++) {
          const t = (x - margin) / width;
          const y = centerY - Math.sin(t * Math.PI) * 60;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(currentX, centerY);
        ctx.closePath();
        ctx.fill();
      }

      // Draw Sun / Moon Marker Orb
      ctx.save();
      ctx.shadowColor = isSunActive && isDay ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillStyle = isSunActive && isDay ? '#f59e0b' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCurve();
  }, [sunriseStr, sunsetStr, isDay]);

  return (
    <section className="sk-panel sun-section">
      <div className="sun-header">
        <h2 className="sk-label">SOLAR TIMELINE</h2>
        <div className="daylight-badge">
          <Clock size={12} />
          <span>Daylight {daylightDurationStr}</span>
        </div>
      </div>

      <div className="sun-canvas-wrapper">
        <canvas ref={canvasRef} className="sun-canvas" />
      </div>

      <div className="sun-metrics-row">
        <div className="sun-time-block">
          <div className="sun-icon-box amber-box">
            <Sunrise size={16} />
          </div>
          <div className="sun-time-details">
            <span className="sk-label">SUNRISE</span>
            <span className="sun-time-val">{sunriseStr || '--:--'}</span>
          </div>
        </div>

        <div className="sun-time-block">
          <div className="sun-icon-box violet-box">
            <Sunset size={16} />
          </div>
          <div className="sun-time-details">
            <span className="sk-label">SUNSET</span>
            <span className="sun-time-val">{sunsetStr || '--:--'}</span>
          </div>
        </div>
      </div>

      <style>{`
        .sun-section {
          width: 100%;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          height: 100%;
        }

        .sun-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .daylight-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: 20px;
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
        }

        .sun-canvas-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin: 4px 0;
        }

        .sun-canvas {
          width: 100%;
          max-width: 340px;
          height: 100px;
        }

        .sun-metrics-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-subtle);
          padding-top: 14px;
        }

        .sun-time-block {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sun-icon-box {
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .amber-box {
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent-amber);
        }

        .violet-box {
          background: rgba(168, 85, 247, 0.1);
          color: var(--accent-violet);
        }

        .sun-time-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sun-time-val {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }
      `}</style>
    </section>
  );
}
