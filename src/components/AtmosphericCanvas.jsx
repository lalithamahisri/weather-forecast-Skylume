import React from 'react';

export default function AtmosphericCanvas({ conditionKey = 'clear', isDay = true }) {
  const isNight = !isDay;

  return (
    <div className="atmospheric-canvas-container">
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="atmospheric-svg"
      >
        <defs>
          {/* Sun radiance glow gradient */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-amber)" stopOpacity="0.4" />
            <stop offset="60%" stopColor="var(--accent-amber)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--accent-amber)" stopOpacity="0" />
          </radialGradient>

          {/* Moon glow gradient */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.35" />
            <stop offset="70%" stopColor="var(--accent-primary)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
          </radialGradient>

          {/* Cloud linear fill */}
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0.02" />
          </linearGradient>

          {/* Rain streak gradient */}
          <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 1. CLEAR / SUNNY (DAY) */}
        {conditionKey === 'clear' && !isNight && (
          <g className="atmosphere-sunny">
            {/* Outer Orbital Rings */}
            <circle cx="210" cy="105" r="85" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="210" cy="105" r="60" stroke="var(--border-medium)" strokeWidth="1" />
            
            {/* Ambient Sun Glow */}
            <circle cx="210" cy="105" r="90" fill="url(#sunGlow)" className="pulse-glow" />

            {/* Core Sun Disc */}
            <circle cx="210" cy="105" r="28" fill="var(--accent-amber)" opacity="0.9" />

            {/* Orbital Marker */}
            <circle cx="270" cy="105" r="4" fill="var(--accent-amber)" />
          </g>
        )}

        {/* 2. CLEAR / NIGHT */}
        {(conditionKey === 'clear' && isNight) && (
          <g className="atmosphere-night">
            <circle cx="210" cy="105" r="75" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="210" cy="105" r="80" fill="url(#moonGlow)" />
            
            {/* Moon Crescent */}
            <path
              d="M210 75C226.569 75 240 88.4315 240 105C240 121.569 226.569 135 210 135C202.5 135 195.6 132.2 190 127.5C197.5 125 203 117.8 203 109C203 100.2 197.5 93 190 90.5C195.6 85.8 202.5 83 210 75Z"
              fill="var(--accent-primary)"
              opacity="0.85"
            />

            {/* Subtle Stars */}
            <circle cx="120" cy="60" r="1.5" fill="var(--text-primary)" opacity="0.6" />
            <circle cx="150" cy="140" r="2" fill="var(--text-primary)" opacity="0.4" />
            <circle cx="270" cy="70" r="1.5" fill="var(--text-primary)" opacity="0.7" />
          </g>
        )}

        {/* 3. CLOUDY / OVERCAST */}
        {(conditionKey === 'cloudy' || conditionKey === 'fog') && (
          <g className="atmosphere-cloudy">
            <path
              d="M100 145 C100 120, 125 105, 150 115 C165 95, 205 95, 220 115 C240 115, 255 130, 250 145 Z"
              fill="url(#cloudGrad)"
              stroke="var(--border-medium)"
              strokeWidth="1.5"
            />
            <path
              d="M70 160 C70 140, 90 130, 110 138 C122 120, 155 120, 168 138 C185 138, 195 150, 190 160 Z"
              fill="url(#cloudGrad)"
              stroke="var(--border-subtle)"
              strokeWidth="1"
              opacity="0.7"
            />
          </g>
        )}

        {/* 4. RAIN */}
        {conditionKey === 'rain' && (
          <g className="atmosphere-rain">
            {/* Cloud shape */}
            <path
              d="M90 120 C90 100, 115 88, 138 98 C150 80, 190 80, 205 98 C222 98, 235 110, 230 120 Z"
              fill="url(#cloudGrad)"
              stroke="var(--border-medium)"
              strokeWidth="1.5"
            />
            {/* Falling rain vector lines */}
            <line x1="110" y1="135" x2="102" y2="175" stroke="url(#rainGrad)" strokeWidth="2" strokeLinecap="round" className="rain-drop-1" />
            <line x1="140" y1="135" x2="132" y2="175" stroke="url(#rainGrad)" strokeWidth="2" strokeLinecap="round" className="rain-drop-2" />
            <line x1="170" y1="135" x2="162" y2="175" stroke="url(#rainGrad)" strokeWidth="2" strokeLinecap="round" className="rain-drop-3" />
            <line x1="200" y1="135" x2="192" y2="175" stroke="url(#rainGrad)" strokeWidth="2" strokeLinecap="round" className="rain-drop-4" />
          </g>
        )}

        {/* 5. THUNDERSTORM */}
        {conditionKey === 'thunderstorm' && (
          <g className="atmosphere-thunderstorm">
            <path
              d="M90 110 C90 90, 115 78, 138 88 C150 70, 190 70, 205 88 C222 88, 235 100, 230 110 Z"
              fill="url(#cloudGrad)"
              stroke="var(--accent-violet)"
              strokeWidth="1.5"
            />
            {/* Lightning vector */}
            <path
              d="M165 115 L145 145 L160 145 L140 185"
              stroke="var(--accent-amber)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="lightning-bolt"
            />
            <line x1="110" y1="125" x2="102" y2="165" stroke="url(#rainGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="200" y1="125" x2="192" y2="165" stroke="url(#rainGrad)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* 6. SNOW */}
        {conditionKey === 'snow' && (
          <g className="atmosphere-snow">
            <path
              d="M90 115 C90 95, 115 83, 138 93 C150 75, 190 75, 205 93 C222 93, 235 105, 230 115 Z"
              fill="url(#cloudGrad)"
              stroke="var(--border-medium)"
              strokeWidth="1.5"
            />
            <circle cx="115" cy="140" r="3" fill="var(--text-primary)" opacity="0.8" />
            <circle cx="150" cy="160" r="2.5" fill="var(--text-primary)" opacity="0.7" />
            <circle cx="185" cy="145" r="3.5" fill="var(--text-primary)" opacity="0.8" />
            <circle cx="210" cy="165" r="2" fill="var(--text-primary)" opacity="0.6" />
          </g>
        )}
      </svg>

      <style>{`
        .atmospheric-canvas-container {
          width: 100%;
          height: 100%;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .atmospheric-svg {
          width: 100%;
          max-width: 320px;
          height: auto;
          overflow: visible;
        }
        .pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite alternate;
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.96); opacity: 0.7; }
          100% { transform: scale(1.04); opacity: 1; }
        }
        .rain-drop-1 { animation: fallRain 1.2s linear infinite; }
        .rain-drop-2 { animation: fallRain 1.4s linear 0.3s infinite; }
        .rain-drop-3 { animation: fallRain 1.1s linear 0.6s infinite; }
        .rain-drop-4 { animation: fallRain 1.3s linear 0.1s infinite; }

        @keyframes fallRain {
          0% { transform: translateY(-10px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }

        .lightning-bolt {
          animation: flashBolt 3s ease-in-out infinite;
        }
        @keyframes flashBolt {
          0%, 85%, 100% { opacity: 0.2; }
          90% { opacity: 1; filter: drop-shadow(0 0 8px var(--accent-amber)); }
        }
      `}</style>
    </div>
  );
}
