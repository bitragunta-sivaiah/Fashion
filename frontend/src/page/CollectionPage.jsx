import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from "react-icons/fa";
import FilterSlider from '../components/FilterSlider';
import SortOptions from '../components/SortOptions';
import ProductCard from '../components/ProductCard';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, setFilters } from '../store/productSlice';

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, status, error, filters } = useSelector((state) => state.products);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  const [sortOption, setSortOption] = useState("priceAsc");
  const initialFilters = {
    category: '',
    size: '',
    color: '',
    gender: '',
    material: '',
    brand: '',
    minPrice: 0,
    maxPrice: 0,
  };

  useEffect(() => {
    // Clear search parameters and reset filters when the component is mounted
    setSearchParams({});
    dispatch(setFilters(initialFilters));
    dispatch(fetchAllProducts());
  }, [dispatch, setSearchParams]);

  useEffect(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    dispatch(setFilters(params));
  }, [searchParams, dispatch]);

  useEffect(() => {
    const params = {};
    if (filters.gender) {
      params.gender = filters.gender;
    }
    if (filters.size) {
      params.size = filters.size;
    }
    if (filters.color) {
      params.color = filters.color;
    }
    if (filters.category) {
      params.category = filters.category;
    }
    if (filters.minPrice) {
      params.minPrice = filters.minPrice;
    }
    if (filters.maxPrice) {
      params.maxPrice = filters.maxPrice;
    }
    if (filters.material) {
      params.material = filters.material;
    }
    if (filters.brand) {
      params.brand = filters.brand;
    }
    if (filters.search) {
      params.search = filters.search;
    }
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const applyFiltersAndSorting = () => {
    let filteredProducts = [...products];

    if (filters.gender) {
      filteredProducts = filteredProducts.filter(product => product.gender === filters.gender);
    }
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }
    if (filters.size) {
      filteredProducts = filteredProducts.filter(product => product.sizes.includes(filters.size));
    }
    if (filters.color) {
      filteredProducts = filteredProducts.filter(product => product.colors.includes(filters.color));
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice);
    }
    if (filters.material) {
      filteredProducts = filteredProducts.filter(product => product.material === filters.material);
    }
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(product => filters.brand.includes(product.brand));
    }
    if (filters.search) {
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(filters.search.toLowerCase()));
    }

    if (sortOption === "priceAsc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceDesc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "popularity") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    return filteredProducts;
  };

  const filteredAndSortedProducts = applyFiltersAndSorting();

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSideBarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(setFilters(initialFilters));
    setSearchParams({});
  };

  return (
    <div className="flex relative md:flex-row flex-col">
      <button onClick={toggleSidebar} className="lg:hidden border border-gray-400 p-2 flex justify-center items-center">
        <FaFilter /> Filters
      </button>
      <div ref={sidebarRef} className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64 bg-white shadow-md overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64`}>
        <FilterSlider filters={filters} setFilters={handleFilterChange} products={products} clearFilters={clearFilters} />
      </div>
      <div className="flex-1 h-screen overflow-y-auto p-4 ">
        <div className="flex items-center  justify-between ">
        <h2 className="text-2xl uppercase mb-4">
          All Collections
        </h2>
       <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
       </div>
     
        {error ? (
          <p>Error fetching products: {error.message}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
