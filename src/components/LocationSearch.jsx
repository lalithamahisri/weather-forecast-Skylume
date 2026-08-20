import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';

export default function LocationSearch({ onSelectLocation, onSearchQuery }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch location autocomplete suggestions
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
      <form onSubmit={(e) => { e.preventDefault(); handleTriggerSearch(query); }} className="search-form">
        <button
          type="submit"
          title="Search location"
          className="search-btn"
          aria-label="Submit search"
        >
          <Search size={15} />
        </button>

        <input
          type="text"
          placeholder="Search city (e.g. London, Tokyo, Hyderabad)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="search-input"
          aria-label="Search city or location"
        />

        {loading && (
          <div className="search-spinner">
            <Loader2 size={14} className="animate-spin" />
          </div>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions-dropdown sk-panel">
          {suggestions.map((item, index) => (
            <li
              key={item.id || index}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`suggestion-item ${activeIndex === index ? 'suggestion-active' : ''}`}
            >
              <MapPin size={14} className="suggestion-icon" />
              <div className="suggestion-info">
                <span className="suggestion-city">{item.name}</span>
                <span className="suggestion-region">
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
        }

        .search-form {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-btn {
          position: absolute;
          left: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          z-index: 2;
        }

        .search-btn:hover {
          color: var(--accent-primary);
        }

        .search-input {
          width: 100%;
          height: 38px;
          padding: 0 36px 0 38px;
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-sans);
          color: var(--text-primary);
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          outline: none;
          transition: var(--transition-fast);
        }

        .search-input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .search-spinner {
          position: absolute;
          right: 12px;
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          z-index: 1000;
          list-style: none;
          padding: 4px;
          border-radius: var(--inner-radius);
          box-shadow: var(--shadow-lg);
          background: var(--bg-primary);
          border: 1px solid var(--border-medium);
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .suggestion-active {
          background: var(--bg-surface-hover);
        }

        .suggestion-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .suggestion-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .suggestion-city {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .suggestion-region {
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
