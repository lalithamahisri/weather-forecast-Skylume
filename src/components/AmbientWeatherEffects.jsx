import React, { useEffect, useRef, useState } from 'react';

export default function AmbientWeatherEffects({ weather, theme = 'dark' }) {
  const canvasRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const conditionKey = weather?.current?.conditionKey || 'clear';
  const conditionLabel = (weather?.current?.condition || '').toLowerCase();
  const weatherCode = weather?.current?.weatherCode;
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

  // Determine refined effect classification & intensity
  const getEffectDetails = () => {
    const isThunder = conditionKey === 'thunderstorm' || (weatherCode >= 95 && weatherCode <= 99) || conditionLabel.includes('thunder');
    const isDrizzle = (weatherCode >= 51 && weatherCode <= 57) || conditionLabel.includes('drizzle') || conditionLabel.includes('slight rain');
    const isHeavyRain = weatherCode === 65 || weatherCode === 67 || weatherCode === 82 || conditionLabel.includes('heavy') || conditionLabel.includes('violent');
    const isShowers = (weatherCode >= 80 && weatherCode <= 82) || conditionLabel.includes('shower');
    const isGeneralRain = conditionKey === 'rain' || conditionLabel.includes('rain') || isDrizzle || isHeavyRain || isShowers;

    if (isThunder) {
      return { type: 'thunderstorm', subtype: 'thunderstorm', intensity: 'heavy' };
    }
    if (isGeneralRain) {
      if (isDrizzle) return { type: 'rain', subtype: 'drizzle', intensity: 'light' };
      if (isHeavyRain) return { type: 'rain', subtype: 'heavy', intensity: 'heavy' };
      if (isShowers) return { type: 'rain', subtype: 'showers', intensity: 'moderate' };
      return { type: 'rain', subtype: 'moderate', intensity: 'moderate' };
    }
    if (conditionKey === 'snow' || conditionLabel.includes('snow')) {
      return { type: 'snow', subtype: 'snow', intensity: 'moderate' };
    }
    if (conditionKey === 'cloudy' || conditionLabel.includes('cloud') || conditionLabel.includes('overcast')) {
      return { type: 'cloudy', subtype: 'cloudy', intensity: 'moderate' };
    }
    if (conditionKey === 'fog' || conditionLabel.includes('fog') || conditionLabel.includes('mist')) {
      return { type: 'fog', subtype: 'fog', intensity: 'moderate' };
    }
    
    if (conditionKey === 'clear') {
      if (!isDay) return { type: 'clear-night', subtype: 'clear-night', intensity: 'normal' };
      if (temperature >= 30) return { type: 'clear-hot', subtype: 'clear-hot', intensity: 'normal' };
      if (temperature <= 10) return { type: 'clear-cold', subtype: 'clear-cold', intensity: 'normal' };
      return { type: 'clear-day', subtype: 'clear-day', intensity: 'normal' };
    }

    if (windSpeed > 25) return { type: 'windy', subtype: 'windy', intensity: 'moderate' };
    return { type: 'default', subtype: 'default', intensity: 'normal' };
  };

  const effectDetails = getEffectDetails();
  const effectType = effectDetails.type;

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

    const isLightMode = theme === 'light' || document.documentElement.getAttribute('data-theme') === 'light';

    let particles = [];
    const width = canvas.width;
    const height = canvas.height;

    if (effectType === 'rain' || effectType === 'thunderstorm') {
      const isDrizzle = effectDetails.subtype === 'drizzle';
      const isHeavy = effectDetails.subtype === 'heavy';
      const isThunder = effectType === 'thunderstorm';

      // Particle counts based on condition
      const count = isDrizzle ? 130 : isHeavy ? 300 : isThunder ? 340 : 220;

      for (let i = 0; i < count; i++) {
        const depth = Math.random(); // 0 (far) to 1 (near)
        
        let length, speed, thickness, opacity, slant, slantSpeed;

        if (isDrizzle) {
          length = depth * 14 + 14;          // 14px to 28px
          speed = depth * 6 + 9;            // 9 to 15 px/frame
          thickness = depth * 0.8 + 1.2;    // 1.2px to 2.0px
          opacity = isLightMode ? (depth * 0.35 + 0.55) : (depth * 0.35 + 0.45);
          slant = 1.2;
          slantSpeed = 0.4;
        } else if (isHeavy || isThunder) {
          length = depth * 30 + 35;         // 35px to 65px
          speed = depth * 14 + 20;          // 20 to 34 px/frame
          thickness = depth * 1.2 + 1.8;    // 1.8px to 3.0px
          opacity = isLightMode ? (depth * 0.35 + 0.65) : (depth * 0.35 + 0.55);
          slant = 3.5;
          slantSpeed = 1.2;
        } else {
          // Moderate rain & showers
          length = depth * 22 + 24;         // 24px to 46px
          speed = depth * 10 + 14;          // 14 to 24 px/frame
          thickness = depth * 1.0 + 1.4;    // 1.4px to 2.4px
          opacity = isLightMode ? (depth * 0.35 + 0.60) : (depth * 0.35 + 0.50);
          slant = 2.4;
          slantSpeed = 0.8;
        }

        particles.push({
          x: Math.random() * (width + 100) - 50,
          y: Math.random() * height,
          length,
          speed,
          thickness,
          opacity,
          slant,
          slantSpeed
        });
      }
    } else if (effectType === 'snow') {
      for (let i = 0; i < 75; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 3.5 + 1.2,
          speedY: Math.random() * 1.8 + 0.6,
          speedX: Math.random() * 1.0 - 0.5,
          opacity: Math.random() * 0.6 + 0.35
        });
      }
    } else if (effectType === 'clear-night') {
      for (let i = 0; i < 85; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.8 + 0.6,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (effectType === 'cloudy' || effectType === 'fog') {
      const count = effectType === 'fog' ? 10 : 15;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.65),
          r: Math.random() * 140 + 90,
          vx: Math.random() * 0.35 + 0.08,
          vy: (Math.random() - 0.5) * 0.05,
          opacity: Math.random() * 0.08 + 0.03
        });
      }
    } else if (effectType === 'clear-hot') {
      for (let i = 0; i < 25; i++) {
        particles.push({
          x: Math.random() * width,
          y: height - Math.random() * 320,
          r: Math.random() * 2.2 + 1,
          vy: Math.random() * 0.6 + 0.25,
          vx: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.35 + 0.12
        });
      }
    }

    let lightningTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (effectType === 'rain' || effectType === 'thunderstorm') {
        particles.forEach((p) => {
          // Luminous gradient for each falling raindrop streak (adapted to light/dark themes)
          const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.slant, p.y + p.length);
          if (isLightMode) {
            grad.addColorStop(0, `rgba(56, 189, 248, ${p.opacity * 0.25})`);
            grad.addColorStop(0.65, `rgba(2, 132, 199, ${p.opacity * 0.90})`);
            grad.addColorStop(1, `rgba(3, 105, 161, ${p.opacity})`);
          } else {
            grad.addColorStop(0, `rgba(200, 235, 255, ${p.opacity * 0.15})`);
            grad.addColorStop(0.65, `rgba(215, 245, 255, ${p.opacity * 0.85})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${p.opacity})`);
          }

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.slant, p.y + p.length);
          ctx.strokeStyle = grad;
          ctx.lineWidth = isLightMode ? p.thickness * 1.15 : p.thickness;
          ctx.lineCap = 'round';
          ctx.stroke();

          p.y += p.speed;
          p.x -= p.slantSpeed;

          if (p.y > canvas.height) {
            p.y = -p.length - Math.random() * 25;
            p.x = Math.random() * (canvas.width + 100) - 50;
          }
          if (p.x < -60) {
            p.x = canvas.width + 40;
          }
        });

        // Lightning flash pulse for thunderstorm
        if (effectType === 'thunderstorm') {
          lightningTimer++;
          if (lightningTimer % 240 === 0 || Math.random() < 0.0035) {
            ctx.fillStyle = isLightMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.14)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      } else if (effectType === 'snow') {
        ctx.fillStyle = isLightMode ? '#0284c7' : '#ffffff';
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
          const opacity = Math.abs(Math.sin(p.phase)) * 0.75 + 0.2;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      } else if (effectType === 'cloudy' || effectType === 'fog') {
        ctx.fillStyle = isLightMode ? 'rgba(148, 163, 184, 0.22)' : effectType === 'fog' ? 'rgba(203, 213, 225, 0.16)' : 'rgba(255, 255, 255, 0.09)';
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
        ctx.fillStyle = 'rgba(251, 146, 60, 0.45)';
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
  }, [effectType, effectDetails.subtype, reducedMotion, theme]);

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
