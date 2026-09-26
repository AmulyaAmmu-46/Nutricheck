const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createOrUpdateProfile,
  getProfile
} = require('../controllers/profileController');

// All profile routes require authentication
router.use(authMiddleware);

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', createOrUpdateProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', createOrUpdateProfile);

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', getProfile);

module.exports = router;



