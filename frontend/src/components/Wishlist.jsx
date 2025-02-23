import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';

const Wishlist = ({handleWishlistClick}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist(user._id));
    }
  }, [dispatch, user]);

  const handleAddToCart = (item) => {
    const cartItem = {
      productId: item.productId._id,
      image: item.productId.images && item.productId.images[0] ? item.productId.images[0].url : '',
      size: item.size || 'default-size',
      color: item.color || 'default-color',
      totalPrice: item.price,
      cartTotalPrice: item.price,
      countInStock: item.productId.countInStock, // Ensure this field is available in the product
      user: user._id, // Add user ID to the cart item
      ...item
    };
    toast.success('item added successfully')
    handleWishlistClick()
    dispatch(addToCart(cartItem));
  };

  const handleRemoveFromWishlist = (itemId) => {
    if (user) {
      dispatch(removeFromWishlist({ userId: user._id, itemId }));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
      <div className="flex flex-wrap gap-6 h-fit items-center justify-center">
        {wishlistItems.map((item) => {
          const originalPrice = item.price / (1 - (item.discountPrice / 100));

          return (
            <div key={item._id} className="w-[220px]">
              <div className="relative w-full h-[290px] mb-2 shadow-sm overflow-hidden rounded-lg">
                {item.productId.images && item.productId.images[0] && (
                  <img src={item.productId.images[0].url} alt={item.productId.name} className="w-full h-full object-cover" />
                )}
                <button onClick={() => handleRemoveFromWishlist(item._id)} className="absolute top-2 bg-gray-300 rounded-full p-1 cursor-pointer right-2 text-gray-800 text-2xl">
                  <IoClose />
                </button>
              </div>
              <div className="flex flex-col text-sm">
                <h3 className="text-lg font-semibold mb-1">{item.productId.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <p className="text-green-800 font-semibold flex items-center">
                      <MdOutlineCurrencyRupee /> {item.price}
                    </p>
                    {originalPrice && (
                      <p className="text-gray-500 font-medium text-sm line-through ml-2 flex items-center">
                        ₹ {originalPrice.toFixed(0)}
                      </p>
                    )}
                    <p className="text-pink-500 font-medium text-sm ml-3 flex items-center">
                      ({item.discountPrice}% Off)
                    </p>
                  </div>
                </div>
                <button onClick={() => handleAddToCart(item)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
