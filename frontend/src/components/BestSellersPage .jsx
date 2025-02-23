import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBestSellers } from '../store/productSlice';
import toast from 'react-hot-toast'; // Import toast for notifications
import { addToCart } from '../store/cartSlice'; // Import the addToCart action
import { addToWishlist } from '../store/wishlistSlice';

const BestSellersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bestSellers = useSelector((state) => state.products.bestSellers);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const [mainImage, setMainImage] = useState(null);
  const { user } = useSelector((state) => state.auth); // Get the user from state

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) =>
      type === "increment" ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)
    );
  };

  const handleAddToCart = (product) => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
  
    const cartItem = {
      productId: product._id,
      name: product.name,
      image: mainImage,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      countInStock: product.countInStock,
      discountPrice: product.discountPrice,
      totalPrice: product.price * quantity,
      quantity: quantity,
      user: user._id,
      cartTotalPrice: product.price * quantity,
    };

    dispatch(addToCart(cartItem));
    toast.success('Item added to cart');
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);
  };

  useEffect(() => {
    dispatch(fetchBestSellers());
  }, [dispatch]);

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    if(!user){
      toast.error('Please login to add items to the cart');
      navigate('/login')
      return;
    }
    
    if (user) {
      const wishlistItem = {
        productId: product._id,
        name: product.name,
        image: mainImage,
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        originalPrice: product.originalPrice,
        countInStock: product.countInStock,
        discountPrice: product.discountPrice,
        totalPrice: product.price * quantity,
        quantity: quantity,
        user: user._id,
      };
      setIsLoading(true);
      dispatch(addToWishlist({ userId: user._id, item: wishlistItem }));
      toast.success('Item added to wishlist');
      setIsLoading(false);
    } else {
      toast.error('Please login to add items to the wishlist');
      navigate('/login');
    }
  };

// Use it like this in your JSX


  useEffect(() => {
    if (bestSellers && bestSellers.length > 0) {
      setMainImage(bestSellers[0].images[0].url);
    }
  }, [bestSellers]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto w-full bg-white p-8 rounded-lg mb-8">
        {bestSellers.map((product) => (
          <div
            key={product._id}
            className="w-full h-full"
            onClick={(e) => {
              // Check if the click is on the main image
              if (e.target.classList.contains('main-image')) {
                handleProductClick(product._id);
              }
            }}
          >
            <div className="flex flex-col md:flex-row mx-auto w-full">
              <div className="hidden md:flex flex-col space-y-4 mr-6">
                {product.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`${
                      mainImage === image.url
                        ? "border-2 border-green-500 p-[2px]"
                        : ""
                    } w-24 h-20 object-cover rounded-lg cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation(); // Stop click propagation to parent div
                      handleImageClick(image.url);
                    }}
                  />
                ))}
              </div>
              <div className="md:w-1/2">
                <div className="mb-4">
                  <img
                    src={mainImage || product.images[0].url}
                    alt={product.name}
                    className="main-image w-full cursor-pointer h-[600px] object-cover rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop click propagation to parent div
                      handleProductClick(product._id);
                    }}
                  />
                </div>
              </div>
              <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                {product.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`${
                      mainImage === image.url
                        ? "border-2 border-green-500 p-[2px]"
                        : ""
                    } w-24 h-20 object-cover rounded-lg cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation(); // Stop click propagation to parent div
                      handleImageClick(image.url);
                    }}
                  />
                ))}
              </div>
              <div className="md:w-1/2 md:ml-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-xl mb-4">
                  ₹{product.price || product.discountPrice}
                </p>
                <div className="mb-4">
                  <p className="text-gray-700">Color:</p>
                  <div className="flex gap-3 mt-2">
                    {product.colors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelection(color)}
                        className={`w-8 h-8 rounded-full ${
                          selectedColor === color
                            ? "border-4 border-orange-600"
                            : "border-green-300"
                        } cursor-pointer`}
                        style={{
                          background: color.toLowerCase(),
                          filter: "brightness(0.5)",
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700">Size:</p>
                  <div className="flex gap-2 mt-2">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelection(size)}
                        className={`px-4 py-2 rounded-lg border border-gray-200 cursor-pointer ${
                          selectedSize === size ? " bg-black text-white" : ""
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700">Quantity:</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      className="px-2 py-1 cursor-pointer bg-gray-200 rounded-lg"
                      onClick={() => handleQuantityChange("decrement")}
                    >
                      -
                    </button>
                    <span className="text-lg">{quantity}</span>
                    <button
                      className="px-2 py-1 cursor-pointer bg-gray-200 rounded-lg"
                      onClick={() => handleQuantityChange("increment")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`bg-black ${
                    isButtonDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-900"
                  } cursor-pointer text-white py-2 px-6 rounded-lg w-full mb-4`}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                </button>
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className={`bg-[#fa2ba7] ${
                    isButtonDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-[#f30791]"
                  } cursor-pointer text-white py-2 px-6 rounded-lg w-full mb-4`}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? "Adding..." : "ADD TO WISH LIST"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellersPage;
