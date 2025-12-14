import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  priceRange,
  setPriceRange,
}) => {
  const categories = [
    "All",
    "Chocolate",
    "Candy",
    "Gummy",
    "Lollipop",
    "Cake",
    "Cookie",
    "Other",
  ];

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search for sweets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === "All" ? "" : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="price-range-group">
          <label>Max Price: ₹{priceRange}</label>
          <input
            type="range"
            min="0"
            max="4000"
            step="50"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="price-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
