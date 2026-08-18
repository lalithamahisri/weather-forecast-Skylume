import React, { useEffect, useRef, useState } from 'react';

export default function AmbientWeatherEffects({ weather }) {
  const canvasRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const conditionKey = weather?.current?.conditionKey || 'clear';
  const temperature = weather?.current?.temperature ?? 20;
  const isDay = weather?.current?.isDay ?? true;
  const windSpeed = weather?.current?.windSpeed ?? 10;

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine refined effect type
  const getEffectType = () => {
    if (conditionKey === 'thunderstorm') return 'thunderstorm';
    if (conditionKey === 'rain') return 'rain';
    if (conditionKey === 'snow') return 'snow';
    if (conditionKey === 'cloudy') return 'cloudy';
    if (conditionKey === 'fog') return 'fog';
    
    if (conditionKey === 'clear') {
      if (!isDay) return 'clear-night';
      if (temperature >= 30) return 'clear-hot';
      if (temperature <= 10) return 'clear-cold';
      return 'clear-day';
    }

    if (windSpeed > 25) return 'windy';
    return 'default';
  };

  const effectType = getEffectType();

  // Canvas particle animation loop
  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    const width = canvas.width;
    const height = canvas.height;

    if (effectType === 'rain' || effectType === 'thunderstorm') {
      const count = effectType === 'thunderstorm' ? 80 : 50;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 25 + 15,
          speed: Math.random() * 14 + 10,
          opacity: Math.random() * 0.4 + 0.15
        });
      }
    } else if (effectType === 'snow') {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 3 + 1,
          speedY: Math.random() * 1.5 + 0.5,
          speedX: Math.random() * 0.8 - 0.4,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
    } else if (effectType === 'clear-night') {
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.5,
          twinkleSpeed: Math.random() * 0.03 + 0.005,
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (effectType === 'cloudy' || effectType === 'fog') {
      const count = effectType === 'fog' ? 8 : 12;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.6),
          r: Math.random() * 120 + 80,
          vx: Math.random() * 0.3 + 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          opacity: Math.random() * 0.06 + 0.02
        });
      }
    } else if (effectType === 'clear-hot') {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * width,
          y: height - Math.random() * 300,
          r: Math.random() * 2 + 1,
          vy: Math.random() * 0.5 + 0.2,
          vx: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    }

    let lightningTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (effectType === 'rain' || effectType === 'thunderstorm') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
        ctx.lineWidth = 1.2;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speed;
          p.x -= 0.5;

          if (p.y > canvas.height) {
            p.y = -p.length;
            p.x = Math.random() * canvas.width;
          }
        });

        // Lightning flash pulse for thunderstorm
        if (effectType === 'thunderstorm') {
          lightningTimer++;
          if (lightningTimer % 220 === 0 || Math.random() < 0.003) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      } else if (effectType === 'snow') {
        ctx.fillStyle = '#ffffff';
        particles.forEach((p) => {
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > canvas.height) {
            p.y = -p.r;
            p.x = Math.random() * canvas.width;
          }
        });
        ctx.globalAlpha = 1.0;
      } else if (effectType === 'clear-night') {
        ctx.fillStyle = '#ffffff';
        particles.forEach((p) => {
          p.phase += p.twinkleSpeed;
          const opacity = Math.abs(Math.sin(p.phase)) * 0.7 + 0.2;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      } else if (effectType === 'cloudy' || effectType === 'fog') {
        ctx.fillStyle = effectType === 'fog' ? 'rgba(203, 213, 225, 0.15)' : 'rgba(255, 255, 255, 0.08)';
        particles.forEach((p) => {
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x - p.r > canvas.width) p.x = -p.r;
        });
        ctx.globalAlpha = 1.0;
      } else if (effectType === 'clear-hot') {
        ctx.fillStyle = 'rgba(251, 146, 60, 0.4)';
        particles.forEach((p) => {
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.y -= p.vy;
          p.x += p.vx;

          if (p.y < 0) {
            p.y = canvas.height;
            p.x = Math.random() * canvas.width;
          }
        });
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effectType, reducedMotion]);

  const overlayClass = `ambient-overlay ambient-type-${effectType}`;

  return (
    <div className="ambient-weather-container" aria-hidden="true">
      <div className={overlayClass} />
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="ambient-canvas"
        />
      )}
    </div>
  );
}
