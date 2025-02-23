import React, { useState, useEffect } from 'react';

const FilterSlider = ({ filters, setFilters, products, clearFilters }) => {
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    if (products.length) {
      const highestPrice = Math.max(...products.map(product => product.price));
      setMaxPrice(highestPrice);
    }
  }, [products]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const getUniqueValues = (key) => {
    const values = products.map(product => product[key]).flat();
    return [...new Set(values)].map(value => ({
      value,
      label: Array.isArray(value) ? value.join('') : value,
    }));
  };

  const filterProductsByGender = (gender) => {
    return products.filter(product => product.gender === gender);
  };

  const getFilteredOptions = (key) => {
    if (filters.gender) {
      return [...new Set(filterProductsByGender(filters.gender).map(product => product[key]).flat())];
    }
    return [...new Set(products.map(product => product[key]).flat())];
  };

  return (
    <div className="  md:p-4 px-10  ">
      <h2 className="font-semibold text-2xl text-center my-5">Apply Filters</h2>
      <div className="filter-group mb-4">
        <label className="block mb-1">Category</label>
        <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full border border-gray-300 p-2">
          <option value="">All</option>
          {getFilteredOptions('category').map((value, index) => (
            <option key={index} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block mb-1">Size</label>
        <select name="size" value={filters.size} onChange={handleFilterChange} className="w-full border border-gray-300 p-2">
          <option value="">All</option>
          {getFilteredOptions('sizes').map((value, index) => (
            <option key={index} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block mb-1">Color</label>
        <select name="color" value={filters.color} onChange={handleFilterChange} className="w-full border border-gray-300 p-2">
          <option value="">All</option>
          {getUniqueValues('colors').map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block mb-1">Gender</label>
        <select name="gender" value={filters.gender} onChange={handleFilterChange} className="w-full border border-gray-300 p-2">
          <option value="">All</option>
          {getUniqueValues('gender').map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block mb-1">Material</label>
        <select name="material" value={filters.material} onChange={handleFilterChange} className="w-full border border-gray-300 p-2">
          <option value="">All</option>
          {getFilteredOptions('material').map((value, index) => (
            <option key={index} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block mb-1">Brand</label>
        <select name="brand" value={filters.brand} onChange={handleFilterChange} className="w-full border border-gray-300 p-2">
          <option value="">All</option>
          {getFilteredOptions('brand').map((value, index) => (
            <option key={index} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block mb-1">Price Range: {filters.maxPrice || maxPrice}</label>
        <input
          type="range"
          name="maxPrice"
          min="0"
          max={maxPrice}
          value={filters.maxPrice || maxPrice}
          onChange={handleFilterChange}
          className="w-full mb-2"
        />
      </div>
      <div className="flex justify-end">
        <button onClick={clearFilters} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Clear Filters
        </button>
          </div>
    </div>
  );
};

export default FilterSlider;
