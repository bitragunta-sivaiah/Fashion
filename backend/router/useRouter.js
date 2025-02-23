import express from 'express';
import User from '../model/user.js';
import jwt from 'jsonwebtoken';
import { protect, admin } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

// Register a new user
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    const user = new User({ name, email, password });
    await user.save();

    // Create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '40h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Login a user
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '40h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        message: 'User logged in successfully',
        data: {
          user, token
        }
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

// Logout a user
authRouter.post('/logout', protect, async (req, res) => {
  try {
    res.clearCookie('token'); // Clear the JWT cookie if using httpOnly cookies
    res.status(200).json({
      message: 'User logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user profile
authRouter.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Get all users (admin)
authRouter.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      message: 'Fetched all users',
      data: { users }
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Update user role (admin)
authRouter.put('/role/:id', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Delete user (admin)
authRouter.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      message: 'User deleted successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Update user profile
authRouter.put('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

export default authRouter;
