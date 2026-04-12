const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // No token
  if (!token) {
    return res.status(401).json({
      message: 'Not authorized — please log in first'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    // Check if user exists or inactive
    if (!req.user || req.user.status === 'inactive') {
      return res.status(401).json({
        message: 'Account not found or deactivated'
      });
    }

    next(); // Proceed
  } catch (err) {
    return res.status(401).json({
      message: 'Token is invalid or has expired'
    });
  }
};

module.exports = { protect };