import React from 'react';

export default function AtmosphericBackground({ conditionKey = 'clear', isDay = true }) {
  // Determine background style class based on condition & day/night
  let bgType = 'clear-day';
  if (conditionKey === 'rain') {
    bgType = isDay ? 'rain' : 'rain-night';
  } else if (conditionKey === 'thunderstorm') {
    bgType = 'thunderstorm';
  } else if (conditionKey === 'snow') {
    bgType = 'snow';
  } else if (conditionKey === 'fog') {
    bgType = 'fog';
  } else if (conditionKey === 'cloudy') {
    bgType = isDay ? 'cloudy' : 'night';
  } else if (!isDay) {
    bgType = 'night';
  }

  return (
    <div className={`atmospheric-bg-root bg-type-${bgType}`}>
      <div className="atmospheric-dark-overlay" />
      <div className="atmospheric-vignette" />

      <style>{`
        .atmospheric-bg-root {
          position: fixed;
          inset: 0;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          transition: background 1.5s ease;
          background-size: cover;
          background-position: center;
        }

        /* Clear Day: Subtle warm ambient glow with deep dark atmosphere */
        .bg-type-clear-day {
          background: 
            radial-gradient(circle at 75% 15%, rgba(245, 158, 11, 0.18) 0%, transparent 55%),
            radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
            linear-gradient(180deg, #090e17 0%, #06090f 100%);
        }

        /* Night: Deep cosmic navy blue with purple ambient glow */
        .bg-type-night {
          background: 
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.18) 0%, transparent 55%),
            radial-gradient(circle at 20% 70%, rgba(99, 102, 241, 0.14) 0%, transparent 60%),
            linear-gradient(180deg, #050811 0%, #03050a 100%);
        }

        /* Rain: Dark oceanic atmosphere */
        .bg-type-rain {
          background: 
            radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.22) 0%, transparent 65%),
            radial-gradient(circle at 80% 70%, rgba(30, 41, 59, 0.4) 0%, transparent 50%),
            linear-gradient(180deg, #060c16 0%, #04070d 100%);
        }

        /* Rain Night: Deep moody dark teal navy */
        .bg-type-rain-night {
          background: 
            radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.16) 0%, transparent 65%),
            radial-gradient(circle at 80% 70%, rgba(30, 27, 75, 0.35) 0%, transparent 50%),
            linear-gradient(180deg, #040810 0%, #020408 100%);
        }

        /* Thunderstorm: Dramatic electric purple atmosphere */
        .bg-type-thunderstorm {
          background: 
            radial-gradient(circle at 50% 10%, rgba(168, 85, 247, 0.28) 0%, transparent 60%),
            radial-gradient(circle at 30% 60%, rgba(56, 189, 248, 0.18) 0%, transparent 60%),
            linear-gradient(180deg, #080612 0%, #040309 100%);
        }

        /* Cloudy: Slate gray atmosphere */
        .bg-type-cloudy {
          background: 
            radial-gradient(circle at 50% 20%, rgba(148, 163, 184, 0.18) 0%, transparent 60%),
            linear-gradient(180deg, #080d16 0%, #05080e 100%);
        }

        /* Snow: Cool icy blue atmosphere */
        .bg-type-snow {
          background: 
            radial-gradient(circle at 50% 20%, rgba(224, 242, 254, 0.2) 0%, transparent 60%),
            linear-gradient(180deg, #060f1c 0%, #040810 100%);
        }

        /* Fog: Muted mist atmosphere */
        .bg-type-fog {
          background: 
            radial-gradient(circle at 50% 40%, rgba(203, 213, 225, 0.15) 0%, transparent 65%),
            linear-gradient(180deg, #080c14 0%, #05070c 100%);
        }

        .atmospheric-dark-overlay {
          position: absolute;
          inset: 0;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(7, 10, 15, 0.35) 0%, rgba(7, 10, 15, 0.75) 100%);
        }

        .atmospheric-vignette {
          position: absolute;
          inset: 0;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.5);
        }

        [data-theme="light"] .atmospheric-bg-root {
          background: 
            radial-gradient(circle at 80% 15%, rgba(186, 230, 253, 0.7) 0%, transparent 60%),
            radial-gradient(circle at 20% 70%, rgba(191, 219, 254, 0.6) 0%, transparent 60%),
            linear-gradient(180deg, #dbeafe 0%, #e0f2fe 50%, #eff6ff 100%);
        }

        [data-theme="light"] .atmospheric-dark-overlay {
          background: linear-gradient(180deg, rgba(224, 242, 254, 0.15) 0%, rgba(219, 234, 254, 0.45) 100%);
        }

        [data-theme="light"] .atmospheric-vignette {
          box-shadow: inset 0 0 120px rgba(186, 230, 253, 0.4);
        }
      `}</style>
    </div>
  );
}
