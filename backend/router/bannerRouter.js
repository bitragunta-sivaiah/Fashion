import express from 'express';
import Banner from '../model/banner.js';

const bannerRouter = express.Router();

// Add a new banner
bannerRouter.post('/', async (req, res) => {
    try {
        const { url, public_id, screen } = req.body;

        const newBanner = new Banner({
            url,
            public_id,
            screen
        });

        await newBanner.save();
        res.status(201).send(newBanner);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all banners
bannerRouter.get('/', async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).send(banners);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a banner by ID
bannerRouter.put('/update/:id', async (req, res) => {
    try {
        const { screen, ...updateData } = req.body;

        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            {
                ...updateData,
                screen
            },
            { new: true, runValidators: true }
        );

        if (!updatedBanner) {
            return res.status(404).send();
        }
        res.status(200).send(updatedBanner);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a banner by ID
bannerRouter.delete('/delete/:id', async (req, res) => {
    try {
        const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
        if (!deletedBanner) {
            return res.status(404).send();
        }
        res.status(200).send(deletedBanner);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default bannerRouter;
