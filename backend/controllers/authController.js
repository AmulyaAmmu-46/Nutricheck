const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/generateOTP');

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Validation
    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }]
    });

    if (existingUser) {
      if (existingUser.email === email && !existingUser.isVerified && !existingUser.faceDescriptor) {
        return res.status(200).json({
          success: true,
          message: 'Incomplete registration found. Continue biometric enrollment.',
          data: { userId: existingUser._id, email: existingUser.email }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'User with this email, username, or phone already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      phone,
      password,
      isVerified: false
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Set up biometric authentication to continue.',
      data: {
        userId: user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
      error: error.message
    });
  }
};

const isValidFaceDescriptor = (descriptor) => (
  Array.isArray(descriptor) &&
  descriptor.length === 128 &&
  descriptor.every((value) => Number.isFinite(value))
);

const faceDistance = (first, second) => {
  if (!first || !second || first.length !== 128 || second.length !== 128) return Infinity;
  return Math.sqrt(
    first.reduce((total, value, index) => total + ((value - second[index]) ** 2), 0)
  );
};

/**
 * Save the descriptor generated from the user's camera face during registration.
 */
exports.enrollFace = async (req, res) => {
  try {
    const { email, faceDescriptor } = req.body;
    if (!email || !isValidFaceDescriptor(faceDescriptor)) {
      return res.status(400).json({ success: false, message: 'A valid camera face descriptor is required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.faceDescriptor = faceDescriptor;
    user.isVerified = true;
    await user.save();
    res.json({ success: true, message: 'Face registration completed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Face registration failed', error: error.message });
  }
};

/**
 * Compare a fresh camera descriptor with the enrolled face and issue a JWT.
 */
exports.faceLogin = async (req, res) => {
  try {
    const { email, faceDescriptor } = req.body;
    if (!email || !isValidFaceDescriptor(faceDescriptor)) {
      return res.status(400).json({ success: false, message: 'A valid camera face descriptor is required' });
    }

    const user = await User.findOne({ email }).select('+faceDescriptor');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found with this email' });
    }
    if (!user.isVerified || !user.faceDescriptor || user.faceDescriptor.length !== 128) {
      return res.status(401).json({ success: false, message: 'Face registration is required before login' });
    }

    const distance = faceDistance(user.faceDescriptor, faceDescriptor);
    if (distance > 0.52) {
      return res.status(401).json({ success: false, message: 'Face is not matching' });
    }

    res.json({
      success: true,
      message: 'Face login successful',
      data: {
        token: generateToken(user._id),
        user: { id: user._id, username: user.username, email: user.email, phone: user.phone }
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Face login failed', error: error.message });
  }
};

/**
 * Verify OTP
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP expired
    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Update user
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now login.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.message
    });
  }
};

/**
 * Password login is disabled because biometric authentication is mandatory.
 */
exports.login = async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Biometric authentication is required. Use the biometric login endpoint.'
  });
};

/**
 * Forgot Password - Send OTP
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with that email address' });
    }

    // Generate fresh OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset OTP generated.',
      data: { otp } // Returning for demo purposes since email is removed
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send reset email', error: error.message });
  }
};

/**
 * Reset Password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Assign the new plain text password directly;
    // userSchema.pre('save') handles applying bcrypt!
    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now login with your new password.' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
};
