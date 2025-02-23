import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts, deleteProduct } from '../store/productSlice';
import UploadProduct from '../components/UploadProduct';
import UpdateProduct from '../components/UpdateProduct';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, status, error } = useSelector((state) => state.products);
    console.log(products);
    
    const [currentProductId, setCurrentProductId] = useState(null);
    const [currentMode, setCurrentMode] = useState(null); // 'upload' or 'edit'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedColors, setSelectedColors] = useState('');
    const [selectedSizes, setSelectedSizes] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const handleDeleteProduct = async(productId) => {
        try {
            await dispatch(deleteProduct(productId));
            dispatch(fetchAllProducts());
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    const handleEdit = (productId) => {
        setCurrentMode('edit');
        setCurrentProductId(productId);
    };

    const handleToggleUpload = () => {
        setCurrentMode('upload');
    };

    const handleCancel = () => {
        setCurrentMode(null);
        setCurrentProductId(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const uniqueOptions = (key) => {
        return Array.from(new Set(products.map(product => product[key]).flat())).filter(option => option);
    };

    const filteredProducts = products
        .filter((product) => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === '' || product.category === selectedCategory) &&
            (selectedGender === '' || product.gender === selectedGender) &&
            (selectedBrand === '' || product.brand === selectedBrand) &&
            (selectedColors === '' || product.colors.includes(selectedColors)) &&
            (selectedSizes === '' || product.sizes.includes(selectedSizes))
        )
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Management</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleToggleUpload}
                >
                    Upload Product
                </button>
            </div>
            <div className="mb-6">
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="flex flex-wrap gap-4 mb-6 w-full ">
                <select className="p-2 border border-gray-300 rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {uniqueOptions('category').map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
                <select className="p-2 border border-gray-300 rounded" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                    <option value="">All Genders</option>
                    {uniqueOptions('gender').map((gender, index) => (
                        <option key={index} value={gender}>{gender}</option>
                    ))}
                </select>
                <select className="p-2 border border-gray-300 rounded" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                    <option value="">All Brands</option>
                    {uniqueOptions('brand').map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                    ))}
                </select>
                <select className="p-2 border border-gray-300 rounded" value={selectedColors} onChange={(e) => setSelectedColors(e.target.value)}>
                    <option value="">All Colors</option>
                    {uniqueOptions('colors').flat().map((color, index) => (
                        <option key={index} value={color}>{color}</option>
                    ))}
                </select>
                <select className="p-2 border border-gray-300 rounded" value={selectedSizes} onChange={(e) => setSelectedSizes(e.target.value)}>
                    <option value="">All Sizes</option>
                    {uniqueOptions('sizes').flat().map((size, index) => (
                        <option key={index} value={size}>{size}</option>
                    ))}
                </select>
                <button
    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
    onClick={() => {
        setSelectedCategory('');
        setSelectedGender('');
        setSelectedBrand('');
        setSelectedColors('');
        setSelectedSizes('');
        setSearchTerm('');
    }}
>
    Clear Filters
</button>
            </div>
            {status === 'loading' && <p className="text-blue-500">Loading...</p>}
            {status === 'failed' && <p className="text-red-500">{error}</p>}
            {status === 'succeeded' && (
                <div className="overflow-x-auto w-full">
                    <table className="table-auto w-full bg-white shadow-md rounded my-6">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Sr. No</th>
                                <th className="py-3 px-6 text-left">Image</th>
                                <th className="py-3 px-6 text-left">Price</th>
                                {/* <th className="py-3 px-6 text-left">Material</th> */}
                                {/* <th className="py-3 px-6 text-left">Category</th> */}
                                {/* <th className="py-3 px-6 text-left">Brand</th> */}
                                <th className="py-3 px-6 text-left">Gender</th>
                                <th className="py-3 px-6 text-left">Sizes</th>
                                <th className="py-3 px-6 text-left">Colors</th>
                                <th className="py-3 px-6 text-left">Collections</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-black font-semibold text-sm ">
                            {filteredProducts.map((product, index) => (
                                <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="py-3 px-6 text-left">
                                        {product.images && product.images.length > 0 ? (
                                            <img src={product.images[0].url} alt={product.images[0].altText} className="w-16 h-16 rounded" />
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-left">₹{product.price}</td>
                                    {/* <td className="py-3 px-6 text-left">{product.material}</td> */}
                                    {/* <td className="py-3 px-6 text-left">{product.category}</td> */}
                                    {/* <td className="py-3 px-6 text-left">{product.brand}</td> */}
                                    <td className="py-3 px-6 text-left">
                                        {product.gender}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes.join(', ') : 'N/A'}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {Array.isArray(product.colors) && product.colors.length > 0 ? product.colors.join(', ') : 'N/A'}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {product.collections}
                                    </td>
                                    <td className="py-3 px-6 flex items-center gap-2 text-left">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                            onClick={() => handleEdit(product._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="bg-blue-800 text-white cursor-pointer px-4 py-2 rounded"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            className="bg-blue-800 text-white cursor-pointer px-4 py-2 rounded"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            <div className="my-6">
                {currentMode === 'edit' && currentProductId && (
                    <UpdateProduct
                        productId={currentProductId}
                        onCancel={handleCancel}
                    />
                )}
                {currentMode === 'upload' && (
                    <UploadProduct  onCancel={handleCancel}/>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
