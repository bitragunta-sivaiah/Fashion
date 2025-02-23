import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNewArrivals } from '../store/productSlice';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const NewArrivals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { newArrivals, status, error } = useSelector((state) => state.products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const autoScrollRef = useRef();

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % newArrivals.length;
      sliderRef.current.style.transition = newIndex === 0 ? 'none' : 'transform 0.3s ease-in-out';
      sliderRef.current.style.transform = `translateX(-${newIndex * 100 / getCardCount()}%)`;
      return newIndex;
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + newArrivals.length) % newArrivals.length;
      sliderRef.current.style.transition = newIndex === newArrivals.length - 1 ? 'none' : 'transform 0.3s ease-in-out';
      sliderRef.current.style.transform = `translateX(-${newIndex * 100 / getCardCount()}%)`;
      return newIndex;
    });
  };

  const getCardCount = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 5;
    if (width >= 768) return 4;
    return 2;
  };

  const startAutoScroll = () => {
    stopAutoScroll(); // Clear any existing interval
    autoScrollRef.current = setInterval(handleNext, 1000); // Auto-scroll every second
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const handleImageClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="relative flex items-center flex-col justify-center w-full mt-20 overflow-hidden"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      <h1 className='md:text-4xl text-xl font-bold mb-4'>Unveil the Future: Latest Arrivals</h1>
      <p className='md:text-xl text-sm text-center text-gray-800 mb-5'>
        Discover our latest curated collection, featuring innovative designs and top-tier craftsmanship.
        Elevate your experience with our newest arrivals, tailored to meet your discerning taste.
      </p>

      <button onClick={handlePrevious} className="absolute left-0 p-2 z-10 text-white bg-black bg-opacity-50 transform -translate-y-1/2 rounded-full cursor-pointer top-[70%]">
        <MdKeyboardArrowLeft size={29} />
      </button>
      <div ref={sliderRef} className="flex gap-4 w-full transition-transform ease-in-out duration-300">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        {newArrivals.map((product, index) => (
          <div
            className="product flex-shrink-0 text-center relative overflow-hidden h-[300px] md:h-[400px] w-[calc(100%/2)] md:w-[calc(100%/4)] lg:w-[calc(100%/5)]"
            key={product._id}
            style={{ transform: `translateX(-${currentIndex * 100 / getCardCount()}%)` }}
          >
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover mb-2 cursor-pointer"
              onClick={() => handleImageClick(product)}
            />
            <div className="absolute bottom-0 left-0 mx-auto bg-white/50 w-full py-2">
              <h3 className="md:text-lg font-semibold text-sm line-clamp-1">{product.name}</h3>
              <p className="text-sm font-semibold">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleNext} className="absolute right-0 p-2 z-10 text-white bg-black bg-opacity-50 transform -translate-y-1/2 rounded-full cursor-pointer top-[70%]">
        <MdKeyboardArrowRight size={29} />
      </button>
    </div>
  );
};

export default NewArrivals;
