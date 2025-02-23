import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const SearchPage = () => {
  const { products, status, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchText = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    // Fetch all products when the component is mounted
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Filter products based on the search query
  const filteredProducts = products.filter((product) => {
    const query = searchText.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.material.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) // Add more fields if needed
    );
  });

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl px-5 gap-3 w-full">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
