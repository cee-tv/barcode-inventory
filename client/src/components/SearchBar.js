import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-group">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by barcode, product name, or category..."
          value={query}
          onChange={handleChange}
          className="search-input"
        />
        {query && (
          <button className="clear-button" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
