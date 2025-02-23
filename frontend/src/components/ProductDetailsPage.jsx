import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { fetchProductById, fetchSimilarProducts } from '../store/productSlice';
import toast from 'react-hot-toast';
import { addToCart } from '../store/cartSlice';
import { IoMdRefresh } from 'react-icons/io'; // Import spinner icon
import { addToWishlist } from '../store/wishlistSlice';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state) => state.products.selectedProduct);
  const similarProducts = useSelector((state) => state.products.similarProducts);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const { user } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for button

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

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
      dispatch(fetchSimilarProducts(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0].url);
    }
  }, [product]);

  useEffect(() => {
    setIsButtonDisabled(false); // Reset button state when component mounts
  }, [productId]); // Run this effect when productId changes

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleSimilarProductClick = (similarProductId) => {
    navigate(`/product/${similarProductId}`);
    dispatch(fetchProductById(similarProductId));
    dispatch(fetchSimilarProducts(similarProductId));
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    if(!user){
      toast.error('Please login to add items to the cart');
      navigate('/login')
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

    setIsLoading(true); // Set loading state to true
    await dispatch(addToCart(cartItem));
    toast.success('Item added to cart');
    setIsLoading(false); // Set loading state to false
    setIsButtonDisabled(true);
  };
  

  const handleAddToWishlist = (e) => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    if(!user){
      toast.error('Please login to add items to the cart');
      navigate('/login')
      return;
    }
    e.preventDefault();
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

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center text-lg font-semibold">Loading product details...</div>;
  }
  
  return (
    <div className='py-6'>
      {product && (
        <div className="max-w-6xl mx-auto w-full bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row mx-auto w-full">
            {/* Left Side */}
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
                  onClick={() => handleImageClick(image.url)}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
              {mainImage &&
               <img src={mainImage} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-lg" />}
              </div>
            </div>

            {/* Mobile Thumbnail */}
            <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText}
                  onClick={() => setMainImage(image.url)}
                  className={`${
                    mainImage === image.url
                      ? "border-2 border-green-500 p-[2px]"
                      : ""
                  } w-20 h-20 object-cover rounded-lg cursor-pointer`}
                />
              ))}
            </div>

            {/* Right Side */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-xl mb-4">
                ₹{product?.price || product?.discountPrice || "NA"}
              </p>

              {/* Colors */}
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

              {/* Sizes */}
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

              {/* Quantity */}
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

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`bg-black ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : " "
                } cursor-pointer text-white py-2 uppercase px-6 rounded-lg w-full mb-4 flex justify-center items-center`}
                disabled={isButtonDisabled}
              >
                {isLoading ? (
                  <>
                    <IoMdRefresh className="animate-spin mr-2" /> Adding...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>
              {/* Add to WishList button */}
              <button
                onClick={handleAddToWishlist}
                className={`bg-[#fa2ba7] ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-[#fa2ba7]"
                } cursor-pointer text-white py-2 px-6 uppercase rounded-lg w-full mb-4 flex justify-center items-center`}
                disabled={isButtonDisabled}
              >
                {isLoading ? (
                  <>
                    <IoMdRefresh className="animate-spin mr-2" /> Adding...
                  </>
                ) : (
                  'Add to WishList'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className='text-center text-3xl font-bold my-10'>Similar Products</h2>
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {similarProducts.map((similarProduct) => (
            <div
              key={similarProduct._id}
              className="w-full h-full p-2"
              onClick={() => handleSimilarProductClick(similarProduct._id)}
            >
              <div className='w-full h-[200px] md:h-[300px] shadow overflow-hidden rounded-lg'>
              <img src={similarProduct.images[0].url} 
              alt={similarProduct.name}
                className='w-full h-full object-cover'
              />
              </div>
              <h3 className='font-semibold my-2'>{similarProduct.name}</h3>
              <p className='flex items-center text-md '> <MdOutlineCurrencyRupee/>{similarProduct.price}</p>
              {/* Other similar product details */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
