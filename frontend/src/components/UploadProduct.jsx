import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, uploadImage } from "../store/productSlice";
import Select from "react-select";
import { toast, Toaster } from "react-hot-toast"; // Import react-hot-toast
import { FaTimes } from "react-icons/fa"; // Import icons

import { FiImage, FiTrash2 } from "react-icons/fi";



const sizeOptions = [
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
];

const colorOptions = [
  { label: "Red", value: "Red" },
  { label: "Green", value: "Green" },
  { label: "Blue", value: "Blue" },
  { label: "Black", value: "Black" },
  { label: "White", value: "White" },
];

const UploadProduct = ({onCancel}) => {

    
const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    brand: "",
    category: "",
    gender: "",
    colors: [],
    sizes: [],
    material: "",
    collections: "",
    description: "",
    images: [],
    sku: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const productNumber = products.length + 1;
const sku = `SKU-${productNumber}`

  const handleMultiSelectChange = (name, values) => {
    setProductData({
      ...productData,
      [name]: values.map((value) => value.value),
    });
  };

  const handleRemoveOption = (name, option) => {
    setProductData({
      ...productData,
      [name]: productData[name].filter((item) => item !== option),
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await dispatch(uploadImage(file)).unwrap();
      setProductData({
        ...productData,
        images: [...productData.images, result.data.secure_url], // Add image URL to images array
      });
    }
  };

  const handleRemoveImage = (imageUrl) => {
    setProductData({
      ...productData,
      images: productData.images.filter((image) => image !== imageUrl),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let sku = productData.sku;
    
    // Generate the SKU only if the SKU input field is empty
    if (!sku) {
      const productNumber = products.length + 11;
      sku = `SKU-${productNumber}`;
    }
    
    // Include the generated or existing SKU in the product data
    const newProductData = {
      ...productData,
      sku,
    };
    
    dispatch(createProduct(newProductData));
    setProductData({
      name: "",
      price: "",
      discountPrice: "",
      countInStock: "",
      brand: "",
      category: "",
      gender: "",
      colors: [],
      sizes: [],
      material: "",
      collections: "",
      description: "",
      images: [],
      sku: "",
    });
    toast.success("Product added successfully!");
  };
  
  

  return (
    <div className="fixed  top-0 left-0 w-[100vw] h-[100vh] bg-black/50 flex items-center justify-center">
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Toaster />
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded grid grid-cols-3 gap-4 shadow-md w-full  "
        >
          <h2 className="text-center text-2xl font-bold mb-6 ">Add Product</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={productData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            {productData.images.length > 0 && (
              <div className="mb-2">
                {productData.images.map((imageUrl, index) => (
                  <div key={index} className="relative inline-block mr-2 mb-2">
                    <img
                      src={imageUrl}
                      alt={`Product ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <FiTrash2
                      className="absolute top-0 right-0 text-red-500 cursor-pointer"
                      onClick={() => handleRemoveImage(imageUrl)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price"
            value={productData.discountPrice}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="countInStock"
            placeholder="Count In Stock"
            value={productData.countInStock}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={productData.brand}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={productData.category}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
      <div className="flex flex-col gap-4">
        <span className="text-sm text-red-500  font-semibold">
            *Note : The Text Will Capitalize Ex: Men , Women and Unisex  Select any  one of this options
        </span>
      <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={productData.gender}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
      </div>

          <div className="mb-4">
            {productData.sizes.length > 0 && (
              <div className="mb-2">
                {productData.sizes.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 mr-2 border border-gray-300 rounded"
                  >
                    {size}
                    <FaTimes
                      className="ml-1 cursor-pointer"
                      onClick={() => handleRemoveOption("sizes", size)}
                    />
                  </span>
                ))}
              </div>
            )}
            <Select
              isMulti
              name="sizes"
              placeholder="Sizes"
              options={sizeOptions}
              value={productData.sizes.map((size) =>
                sizeOptions.find((option) => option.value === size)
              )}
              onChange={(values) => handleMultiSelectChange("sizes", values)}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            {productData.colors.length > 0 && (
              <div className="mb-2">
                {productData.colors.map((color, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 mr-2 border border-gray-300 rounded"
                  >
                    {color}
                    <FaTimes
                      className="ml-1 cursor-pointer"
                      onClick={() => handleRemoveOption("colors", color)}
                    />
                  </span>
                ))}
              </div>
            )}
            <Select
              isMulti
              name="colors"
              placeholder="Colors"
              options={colorOptions}
              value={productData.colors.map((color) =>
                colorOptions.find((option) => option.value === color)
              )}
              onChange={(values) => handleMultiSelectChange("colors", values)}
              className="w-full"
            />
          </div>
          <input
            type="text"
            name="collections"
            placeholder="Collections"
            value={productData.collections}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="material"
            placeholder="Material"
            value={productData.material}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
         

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={productData.description}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
         .
         <div className="flex items-center gap-4">
         <button
            type="submit"
            className="w-full p-2 bg-blue-500 h-fit cursor-pointer text-white rounded hover:bg-blue-600"
          >
            Upload product
          </button>
          <button type="button" onClick={onCancel} className="w-full p-2 bg-red-500 h-fit cursor-pointer text-white rounded hover:bg-red-600"> Cancel</button>
         </div>

        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
