import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanners, addBanner, updateBanner, deleteBanner, uploadImage } from '../store/bannerSlice';
 
const BannerManager = () => {
    const dispatch = useDispatch();
    const { banners, status, error, uploadStatus, uploadUrl } = useSelector((state) => state.banners);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [newBanner, setNewBanner] = useState({ url: '', public_id: '', screen: { type: 'mobile', width: '375px', height: '250px' } });
    const [file, setFile] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBanners());
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (uploadStatus === 'succeeded') {
            setNewBanner((prevBanner) => ({
                ...prevBanner,
                url: uploadUrl
            }));
            if (selectedBanner) {
                setSelectedBanner((prevBanner) => ({
                    ...prevBanner,
                    url: uploadUrl
                }));
            }
        }
    }, [uploadStatus, uploadUrl]);

    const handleAddBanner = () => {
        dispatch(addBanner(newBanner));
        setNewBanner({ url: '', public_id: '', screen: { type: 'mobile', width: '375px', height: '250px' } });
        setShowForm(false);
    };

    const handleUpdateBanner = (id) => {
        dispatch(updateBanner({ id, banner: selectedBanner }));
        setSelectedBanner(null);
        setShowForm(false);
    };

    const handleDeleteBanner = (id) => {
        dispatch(deleteBanner(id));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBanner((prevBanner) => ({
            ...prevBanner,
            [name]: value
        }));
    };

    const handleScreenTypeChange = (e) => {
        const screenType = e.target.value;
        const screenDimensions = screenType === 'mobile' ? { width: '375px', height: '250px' } : { width: '1060px', height: '350px' };
        setNewBanner((prevBanner) => ({
            ...prevBanner,
            screen: {
                type: screenType,
                ...screenDimensions
            }
        }));
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedBanner((prevBanner) => ({
            ...prevBanner,
            [name]: value
        }));
    };

    const handleUpdateScreenTypeChange = (e) => {
        const screenType = e.target.value;
        const screenDimensions = screenType === 'mobile' ? { width: '375px', height: '250px' } : { width: '1060px', height: '350px' };
        setSelectedBanner((prevBanner) => ({
            ...prevBanner,
            screen: {
                type: screenType,
                ...screenDimensions
            }
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        dispatch(uploadImage(file));
    };

    const handleShowForm = () => {
        setShowForm(true);
        setSelectedBanner(null);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setNewBanner({ url: '', public_id: '', screen: { type: 'mobile', width: '375px', height: '250px' } });
        setSelectedBanner(null);
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Banner Manager</h2>
            <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={handleShowForm}
            >
                Add Banner
            </button>

            {showForm && (
                <div className="fixed inset-0 overflow-y-scroll flex justify-center items-center">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={handleCloseForm}></div>
                    <div className="bg-white rounded-lg p-6 z-10 w-96">
                        <h3 className="text-xl font-bold mb-4">{selectedBanner ? 'Update Banner' : 'Add New Banner'}</h3>
                        <input
                            type="text"
                            name="public_id"
                            placeholder="Public ID"
                            value={selectedBanner ? selectedBanner.public_id : newBanner.public_id}
                            onChange={selectedBanner ? handleUpdateInputChange : handleInputChange}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <select
                            name="type"
                            value={selectedBanner ? selectedBanner.screen.type : newBanner.screen.type}
                            onChange={selectedBanner ? handleUpdateScreenTypeChange : handleScreenTypeChange}
                            className="mb-2 p-2 border rounded w-full"
                        >
                            <option value="mobile">Mobile</option>
                            <option value="largeScreen">Large Screen</option>
                        </select>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <button
                            onClick={handleUpload}
                            className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
                        >
                            Upload Image
                        </button>
                        {uploadStatus === 'loading' && <p>Uploading...</p>}
                        {uploadStatus === 'failed' && <p>Error uploading image</p>}
                        {(selectedBanner ? selectedBanner.url : newBanner.url) && (
                            <img
                                src={selectedBanner ? selectedBanner.url : newBanner.url}
                                alt="Banner"
                                className="w-full h-auto mb-2"
                            />
                        )}
                        <button
                            onClick={selectedBanner ? () => handleUpdateBanner(selectedBanner._id) : handleAddBanner}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 w-full"
                        >
                            {selectedBanner ? 'Update Banner' : 'Add Banner'}
                        </button>
                    </div>
                </div>
            )}

            {/* Banners Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Se. No</th>
                            <th className="px-4 py-2 border">Image</th>
                            <th className="px-4 py-2 border">Public ID</th>
                            <th className="px-4 py-2 border">Screen Type</th>
                            <th className="px-4 py-2 border">Screen Width</th>
                            <th className="px-4 py-2 border">Screen Height</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map((banner, index) => (
                            <tr key={banner._id}>
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">
                                    <img src={banner.url} alt={banner.public_id} className="w-24 h-auto" />
                                </td>
                                <td className="px-4 py-2 border">{banner.public_id}</td>
                                <td className="px-4 py-2 border">{banner.screen.type}</td>
                                <td className="px-4 py-2 border">{banner.screen.width}</td>
                                <td className="px-4 py-2 border">{banner.screen.height}</td>
                                <td className="px-4 py-2 border">
                                    <button
                                        onClick={() => { setShowForm(true); setSelectedBanner(banner); }}
                                        className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBanner(banner._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BannerManager;
