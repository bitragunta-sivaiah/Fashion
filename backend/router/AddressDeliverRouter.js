import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Address from '../model/addressDeliver.js';
 
const addressRouter = express.Router();

// Add a new address
addressRouter.post('/add', protect, async (req, res) => {
  try {
    const newAddress = await Address.create({ user: req.user._id, ...req.body });
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to add address' });
  }
});

// Update an existing address
addressRouter.put('/update/:id', protect, async (req, res) => {
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update address' });
  }
});

// Get all addresses for a user
addressRouter.get('/all', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch addresses' });
  }
});

 

// Delete an address by ID
addressRouter.delete('/delete/:id', protect, async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete address' });
  }
});

export default addressRouter;
