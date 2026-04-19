// backend/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');
const { sendPasswordResetEmail } = require('../utils/email');

const router = express.Router();

// Helper function — generates a JWT token that expires in 7 days
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });

    if (exists)
      return res.status(400).json({ message: 'Email is already registered' });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ message: 'Invalid email or password' });

    if (user.status === 'inactive')
      return res.status(403).json({
        message:
          'Your account is deactivated. Please contact the admin.',
      });

    const match = await user.matchPassword(password);

    if (!match)
      return res
        .status(400)
        .json({ message: 'Invalid email or password' });

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
// Returns the currently logged-in user's data (requires token)
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.json(user);
});

// ── GET /api/auth/users/:id ───────────────────────────────────
// Returns a user's public profile (requires token)
router.get('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/auth/profile ─────────────────────────────────────
// Update name, bio, or upload a new profile picture
router.put(
  '/profile',
  protect,
  upload.single('profilePic'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (req.body.name) user.name = req.body.name;
      if (req.body.bio) user.bio = req.body.bio;
      if (req.file) user.profilePic = req.file.filename;

      await user.save();

      const updated = await User.findById(user._id).select('-password');

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── PUT /api/auth/change-password ────────────────────────────
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const match = await user.matchPassword(currentPassword);

    if (!match)
      return res.status(400).json({
        message: 'Current password is incorrect',
      });

    user.password = newPassword; // pre-save hook will hash this
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/forgot-password ────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(`\n🔐 Forgot Password Request - Email: ${email}`);

  try {
    const user = await User.findOne({ email });
    console.log(`   Database Search: ${user ? '✓ User found' : '✗ User not found'}`);

    if (!user)
      return res.status(400).json({ message: 'User with this email does not exist' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    console.log(`   Token Generated: ✓`);

    // Send reset email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
    console.log(`   Reset Link: ${resetLink}`);
    console.log(`   Email Service: ${process.env.EMAIL_USER ? '✓ Configured' : '✗ NOT CONFIGURED'}`);
    
    const emailResult = await sendPasswordResetEmail(email, resetToken, resetLink);
    console.log(`   Email Result: ${emailResult.success ? '✓ Sent successfully' : '✗ Failed to send'}`);

    if (!emailResult.success) {
      console.log(`   Error: ${emailResult.error}`);
      console.log(`\n   📋 DEVELOPMENT MODE - Reset Link for Testing:\n   ${resetLink}\n`);
      
      // In development, return the reset link in response
      if (process.env.NODE_ENV !== 'production') {
        return res.status(200).json({ 
          message: 'Email not configured. Using development mode. Check console or below for reset link.',
          resetLink: resetLink,
          isDevelopment: true
        });
      }
      
      return res.status(500).json({ 
        message: emailResult.error || 'Error sending reset email. Please contact support.' 
      });
    }

    res.json({ message: 'Password reset link sent to your email. Please check your inbox and spam folder.' });
  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// ── POST /api/auth/reset-password/:token ──────────────────────
router.post('/reset-password/:token', async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  try {
    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() }, // Check if token hasn't expired
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired reset token' });

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully. Please login with your new password.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;