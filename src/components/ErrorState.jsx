import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="glass-panel error-state-card">
      <div className="error-icon-wrapper">
        <AlertCircle size={32} />
      </div>

      <h2 className="error-title">Location Error</h2>

      <p className="error-message">
        {message || "We couldn't retrieve weather data for this location. Check your connection or search for another city."}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="retry-btn"
        >
          <RefreshCw size={15} className="retry-icon" />
          <span>Try Again</span>
        </button>
      )}

      <style>{`
        .error-state-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
          margin: 40px auto;
          max-width: 460px;
          border-radius: 24px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 25, 45, 0.85) 100%);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        .error-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f87171;
          margin-bottom: 18px;
        }
        .error-title {
          font-size: 19px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          font-family: var(--font-display);
        }
        .error-message {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 24px;
          max-width: 340px;
        }
        .retry-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          border: none;
          background: var(--accent-color);
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px var(--accent-glow);
          transition: var(--transition-fast);
        }
        .retry-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .retry-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
