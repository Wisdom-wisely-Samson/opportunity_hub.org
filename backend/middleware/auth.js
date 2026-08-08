const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'You are not logged in. Please log in to access this resource.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) {
      return sendError(res, 401, 'The user belonging to this token no longer exists.');
    }

    if (!user.isActive) {
      return sendError(res, 401, 'Your account has been deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Invalid or malformed token. Please log in again.');
    }
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Your session has expired. Please log in again.');
    }
    next(err);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
};

module.exports = { protect, optionalAuth };
