import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="sk-panel error-state-card">
      <div className="error-icon-wrapper">
        <AlertCircle size={28} />
      </div>

      <h2 className="sk-heading error-title">Unable to Load Weather</h2>

      <p className="error-message">
        {message || "We couldn't retrieve weather data for this location. Please check your internet connection or search for another city."}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="retry-btn"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}

      <style>{`
        .error-state-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          text-align: center;
          margin: 40px auto;
          max-width: 440px;
          border-color: var(--accent-rose);
        }

        .error-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(244, 63, 94, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-rose);
          margin-bottom: 16px;
        }

        .error-title {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .error-message {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 20px;
          max-width: 320px;
        }

        .retry-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 8px;
          border: none;
          background: var(--accent-primary);
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .retry-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
