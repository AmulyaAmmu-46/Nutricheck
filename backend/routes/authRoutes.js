const express = require('express');
const router = express.Router();
const {
  register,
  enrollFace,
  faceLogin,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/face-enrollment
// @desc    Save a camera face descriptor
// @access  Public
router.post('/face-enrollment', enrollFace);
// @route   POST /api/auth/face-login
// @desc    Verify a camera face descriptor
// @access  Public
router.post('/face-login', faceLogin);

// @route   POST /api/auth/forgot-password
// @desc    Send OTP to email for password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Verify OTP and update user password
// @access  Public
router.post('/reset-password', resetPassword);

module.exports = router;



