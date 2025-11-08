import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialValues = {} }) => {
  const [searchTerm, setSearchTerm] = useState(initialValues.location || initialValues.name || '');
  const [priceRange, setPriceRange] = useState({
    min: initialValues.minPrice || '',
    max: initialValues.maxPrice || ''
  });
  const [minRating, setMinRating] = useState(initialValues.minRating || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const filters = {};

    if (searchTerm.trim()) {
      // Determine if it's a location or name search
      filters.location = searchTerm.trim();
      filters.name = searchTerm.trim();
    }

    if (priceRange.min) {
      filters.minPrice = priceRange.min;
    }

    if (priceRange.max) {
      filters.maxPrice = priceRange.max;
    }

    if (minRating) {
      filters.minRating = minRating;
    }

    onSearch(filters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setMinRating('');
    setShowFilters(false);
    onSearch({});
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-main">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by location or hotel name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <button type="button"
            className="filters-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4.5H21L12 13.5L3 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 10V20H16V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filters
          </button>

          <button type="submit" className="search-button">
            Search
          </button>
        </div>

        {showFilters && (
          <div className="search-filters">
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div className="price-range-inputs">
                <div className="price-input">
                  <span className="price-currency">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    min="0"
                  />
                </div>
                <span className="price-separator">-</span>
                <div className="price-input">
                  <span className="price-currency">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              <select
                className="rating-select"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <button type="button" className="clear-filters" onClick={handleClearFilters}>
              Clear All
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;