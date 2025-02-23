import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { fetchBestSellers } from '../store/productSlice';
import { Link } from 'react-router-dom';

const BestSellerComponent = () => {
    const dispatch = useDispatch();
    const { bestSellers } = useSelector((state) => state.products);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        dispatch(fetchBestSellers());
    }, [dispatch]);

    useEffect(() => {
        if (bestSellers.length > 0) {
            setSelectedProduct(bestSellers[0]);
            setSelectedImage(bestSellers[0].images[0].url);
        }
    }, [bestSellers]);

    const handleImageClick = (image) => {
        setSelectedImage(image.url);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setSelectedImage(product.images[0].url);
    };

    return (
        <div className="best-seller-container p-6 bg-gray-100 rounded-lg">
            <Toaster />
            <h1 className="text-center font-bold text-2xl md:text-4xl mb-5">Best Sellers</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col items-center md:items-start md:flex-row gap-4">
                    <div className="flex md:flex-col gap-2 order-2 md:order-1">
                        {selectedProduct && selectedProduct.images.map((image) => (
                            <img
                                key={image._id}
                                src={image.url}
                                alt={image.altText}
                                onClick={() => handleImageClick(image)}
                                className={`${selectedImage === image.url ? 'border-green-500 border-2 p-1' : ''} w-20 h-20 object-cover cursor-pointer`}
                            />
                        ))}
                    </div>
                    {selectedImage && (
                        <div className="flex-1 order-1 md:order-2 w-full overflow-hidden   h-[660px]  ">
                            <img src={selectedImage} alt="Selected" className="w-full h-full object-cover rounded-lg" />
                        </div>
                    )}
                </div>
                <div className="flex-1 order-3  ">
                    {selectedProduct && (
                        <ProductDetails product={selectedProduct} />
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductDetails = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error('Please select both size and color');
            return;
        }
        // Replace with your add to cart logic
        console.log('Add to cart:', { product, quantity, selectedSize, selectedColor });
        toast.success('Product added to cart successfully');
    };

    return (
        <Link to={`product/${product._id}`} className="product-details-container flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-xl text-gray-900 font-semibold ">$ {product.price}</p>
            <p className="text-gray-800 text-xl">{product.description}</p>
            <div className="colors-container flex  gap-2 flex-col mt-2">
                <label className="text-gray-700">Colors:</label>
                <div className="flex gap-2">
                    {product.colors.map((color) => (
                        <span
                            key={color}
                            style={{
                                background: color.toLowerCase(),
                                filter: "brightness(0.7)",
                              }}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border border-gray-200 cursor-pointer ${selectedColor === color ? 'border-red-500 border-4' : ''}`}
                        ></span>
                    ))}
                </div>
            </div>
            <div className="sizes-container flex flex-col  gap-2 mt-2">
                <label className="text-gray-700">Sizes:</label>
                <div className="flex gap-2">
                    {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border border-gray-300 rounded cursor-pointer ${selectedSize === size ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
            <div className="quantity-container flex items-center gap-2 mt-2">
                <label className="text-gray-700">Quantity:</label>
                <button onClick={handleDecreaseQuantity} className="px-2 py-1 bg-gray-200 rounded-lg">-</button>
                <input type="number" value={quantity} readOnly className="w-8  text-center border border-gray-300 rounded" />
                <button onClick={handleIncreaseQuantity} className="px-2 py-1 bg-gray-200 rounded-lg">+</button>
            </div>
            <button
                onClick={handleAddToCart}
                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
                ADD TO CART
            </button>
            <div className="additional-info mt-4">
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Material:</strong> {product.material}</p>
            </div>
        </Link>
    );
};

export default BestSellerComponent;
