import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Load Cloudinary configuration from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageToCloudinary = async (image) => {
    if (!image) {
        throw new Error('No image provided for upload');
    }

    const buffer = image.buffer || Buffer.from(await image.arrayBuffer());

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'Fashion' },
            (error, uploadResult) => {
                if (error) {
                    return reject(new Error('Cloudinary Upload Failed: ' + error.message));
                }
                resolve(uploadResult);
            }
        );

        uploadStream.end(buffer);
    });
};

export default uploadImageToCloudinary;
