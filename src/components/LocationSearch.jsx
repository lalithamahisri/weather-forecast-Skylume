import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';

export default function LocationSearch({ onSelectLocation, onSearchQuery }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 350);
  const wrapperRef = useRef(null);

  // Close popup on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch location suggestions
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            debouncedQuery
          )}&count=5&language=en&format=json`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
        }
      } catch (err) {
        console.error('Error fetching search suggestions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelect = (item) => {
    onSelectLocation(item.latitude, item.longitude, {
      name: item.name,
      country: item.country || '',
      admin1: item.admin1 || '',
      lat: item.latitude,
      lng: item.longitude
    });
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleTriggerSearch = async (searchText) => {
    const textToSearch = searchText || query;
    if (!textToSearch || !textToSearch.trim()) return;
    setLoading(true);
    if (onSearchQuery) {
      await onSearchQuery(textToSearch.trim());
    }
    setLoading(false);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      } else {
        handleTriggerSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="location-search-wrapper" ref={wrapperRef}>
      <form onSubmit={(e) => { e.preventDefault(); handleTriggerSearch(query); }} className="search-input-container">
        <button
          type="button"
          onClick={() => handleTriggerSearch(query)}
          title="Search location"
          className="search-icon-btn"
        >
          <Search size={18} />
        </button>

        <input
          type="text"
          placeholder="Search city or location (e.g. London, Tokyo)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />

        {loading && (
          <div className="search-loader-icon">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
      </form>

      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions-list glass-panel">
          {suggestions.map((item, index) => (
            <li
              key={item.id || index}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`suggestion-item ${activeIndex === index ? 'suggestion-item-active' : ''}`}
            >
              <MapPin size={16} className="suggestion-pin" />
              <div className="suggestion-text">
                <span className="suggestion-name">{item.name}</span>
                <span className="suggestion-subtext">
                  {[item.admin1, item.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .location-search-wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
        }
        .search-input-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }
        .search-icon-btn {
          position: absolute;
          left: 12px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          z-index: 2;
          transition: var(--transition-fast);
        }
        .search-icon-btn:hover {
          color: var(--accent-color);
        }
        .search-input {
          width: 100%;
          padding: 12px 42px 12px 44px;
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-sans);
          color: var(--text-primary);
          background: rgba(15, 25, 45, 0.6);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          outline: none;
          backdrop-filter: blur(var(--glass-blur));
          transition: var(--transition-smooth);
        }
        .search-input:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px var(--accent-glow);
          background: rgba(15, 25, 45, 0.85);
        }
        .search-loader-icon {
          position: absolute;
          right: 14px;
          color: var(--accent-color);
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .suggestions-list {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          z-index: 9999;
          list-style: none;
          padding: 6px;
          border-radius: 16px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
          background: rgba(15, 25, 45, 0.95);
        }
        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .suggestion-item-active {
          background: var(--card-bg-hover);
        }
        .suggestion-pin {
          color: var(--accent-color);
          flex-shrink: 0;
        }
        .suggestion-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .suggestion-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .suggestion-subtext {
          font-size: 11px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
