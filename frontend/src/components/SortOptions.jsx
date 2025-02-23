// SortOptions.js
import React from 'react';

const SortOptions = ({ sortOption, setSortOption }) => {
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="sort-options mb-4 text-center">
      <label className="block mb-1">Sort By:</label>
      <select value={sortOption} onChange={handleSortChange} className="w-full border border-gray-300 p-2">
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
