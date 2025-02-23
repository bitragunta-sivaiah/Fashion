import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSimilarProducts } from '../store/productSlice';

const SimilarProductsComponent = ({ productId }) => {
    const dispatch = useDispatch();
    const { similarProducts, status } = useSelector((state) => state.products);

    useEffect(() => {
        if (productId) {
            dispatch(fetchSimilarProducts(productId));
        }
    }, [dispatch, productId]);

    return (
        <div className="similar-products-container mt-8">
            <h2 className="text-xl font-bold mb-4">Similar Products</h2>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'succeeded' && (
                <div className="flex gap-4">
                    {similarProducts.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id} className="flex-1">
                            <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg">
                                <img src={product.images[0].url} alt={product.images[0].altText} className="w-full h-48 object-cover rounded-lg mb-4" />
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-800">${product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            {status === 'failed' && <p>Error loading similar products</p>}
        </div>
    );
};

export default SimilarProductsComponent;
