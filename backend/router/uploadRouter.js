import { Router } from 'express';
import multer from 'multer';
import uploadImageToCloudinary from '../utils/uploadImageToCloudinary.js';

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadRouter = Router();

uploadRouter.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        const uploadImage = await uploadImageToCloudinary(file);

        return res.json({
            message: 'Upload done',
            data: uploadImage,
            success: true,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
});

export default uploadRouter;
