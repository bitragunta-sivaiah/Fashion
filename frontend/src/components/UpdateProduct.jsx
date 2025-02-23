import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import {
  updateProduct,
  uploadImage,
  fetchProductById,
} from "../store/productSlice";
import toast from "react-hot-toast";

const UpdateProduct = ({ productId, onCancel }) => {
  const dispatch = useDispatch();
  const { selectedProduct, status, error } = useSelector((state) => state.products);
  
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

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        name: selectedProduct.name || "",
        price: selectedProduct.price || "",
        discountPrice: selectedProduct.discountPrice || "",
        countInStock: selectedProduct.countInStock || "",
        brand: selectedProduct.brand || "",
        category: selectedProduct.category || "",
        gender: selectedProduct.gender || "",
        colors: selectedProduct.colors || [],
        sizes: selectedProduct.sizes || [],
        material: selectedProduct.material || "",
        collections: selectedProduct.collections || "",
        description: selectedProduct.description || "",
        images: selectedProduct.images || [],
        sku: selectedProduct.sku || "",
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (name, values) => {
    setProductData((prevData) => ({
      ...prevData,
      [name]: values.map((option) => option.value),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await dispatch(uploadImage(file)).unwrap();
      setProductData((prevData) => ({
        ...prevData,
        images: [
          ...prevData.images,
          { url: result.data.secure_url, altText: file.name },
        ],
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id: productId, productData }));
    toast.success("Product updated successfully");
    onCancel();
  };

  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded grid grid-cols-3 gap-4 shadow-md w-full max-w-7xl"
      >
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
        {status === "loading" && <p className="text-blue-500">Loading...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={productData.name}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={productData.price}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="number"
              name="discountPrice"
              placeholder="Discount Price"
              value={productData.discountPrice}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="number"
              name="countInStock"
              placeholder="Count In Stock"
              value={productData.countInStock}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={productData.brand}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={productData.category}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex flex-col gap-4">
              <span className="text-sm text-red-500 font-semibold">
                *Note: The Text Will Capitalize Ex: Men, Women, and Unisex. Select any one of these options.
              </span>
              <input
                type="text"
                name="gender"
                placeholder="Gender"
                value={productData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border rounded"
              />
            </div>
            <Select
              name="sizes"
              placeholder="Sizes"
              options={[
                { label: "S", value: "S" },
                { label: "M", value: "M" },
                { label: "L", value: "L" },
                { label: "XL", value: "XL" },
                { label: "XXL", value: "XXL" },
              ]}
              value={productData.sizes.map((size) => ({
                label: size,
                value: size,
              }))}
              onChange={(values) => handleMultiSelectChange("sizes", values)}
              isMulti
              className="mb-4"
            />
            <Select
              name="colors"
              placeholder="Colors"
              options={[
                { label: "Red", value: "Red" },
                { label: "Green", value: "Green" },
                { label: "Blue", value: "Blue" },
                { label: "Black", value: "Black" },
                { label: "White", value: "White" },
              ]}
              value={productData.colors.map((color) => ({
                label: color,
                value: color,
              }))}
              onChange={(values) => handleMultiSelectChange("colors", values)}
              isMulti
              className="mb-4"
            />
            <input
              type="text"
              name="collections"
              placeholder="Collections"
              value={productData.collections}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="material"
              placeholder="Material"
              value={productData.material}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={productData.sku}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={productData.description}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border rounded"
            />

            <div className="mb-4">
              <label className="block mb-2">All Images:</label>
              <div className="grid grid-cols-3 gap-2">
                {productData.images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={img.url}
                      alt={img.altText}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <input type="file" onChange={handleImageUpload} className="mb-4" />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-red-500 text-white px-2 rounded"
              >
               
                {" "}
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default UpdateProduct;
