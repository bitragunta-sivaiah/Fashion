import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa"; // Import wishlist icon
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist } from '../store/wishlistSlice'; // Import addToWishlist action

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get the current user from the auth slice
  const originalPrice = product.price / (1 - (product.discountPrice / 100));

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (user) {
      const wishlistItem = {
        userId: user._id,
        productId: product._id,
        name: product.name,
        image: product.images[0].url,
        price: product.price,
        originalPrice: originalPrice,
        discountPrice: product.discountPrice,
        size: product.size || 'default-size',
        color: product.color || 'default-color'
      };
      dispatch(addToWishlist({ userId: user._id, item: wishlistItem }));
    } else {
      // Handle case when user is not logged in, e.g., show a login prompt
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white p-2 rounded-lg duration-300 relative">
        <div className="w-full h-96 mb-4">
          <img src={product.images[0].url} alt={product.name} className="w-full h-full shadow object-cover rounded-lg" />
        </div>
        <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex">
            <p className="text-green-800 font-semibold text-sm tracking-tighter flex items-center">
              <MdOutlineCurrencyRupee /> {product.price}
            </p>
            <p className="text-gray-500 font-medium text-[10px] mt-1 tracking-tighter flex items-center line-through">
              <MdOutlineCurrencyRupee /> {originalPrice.toFixed(0)}
            </p>
            <p className="text-pink-500 font-medium text-sm ml-3 tracking-tighter flex items-center">
              ({product.discountPrice}% Off)
            </p>
          </div>
          <button onClick={handleAddToWishlist} className="text-red-500 mr-4 text-xl">
            <FaRegHeart />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
