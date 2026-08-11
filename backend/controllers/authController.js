const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { sendSuccess, sendError } = require('../utils/response');
const { hashToken } = require('../utils/helpers');
const emailService = require('../services/emailService');

const signAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
const signRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

const sendTokens = (res, user, statusCode = 200, message = 'Success') => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  return sendSuccess(res, statusCode, message, {
    accessToken,
    refreshToken,
    user: user.toPublicJSON ? user.toPublicJSON() : user,
  });
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const { email, password, role = 'refugee', fullName, organizationName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, 409, 'An account with this email already exists');

    const user = await User.create({ email, password, role, fullName });

    // Create verification token
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create org profile if role is organization
    if (role === 'organization' && organizationName) {
      await Organization.create({ user: user._id, organizationName });
    }

    // Send emails (don't block response)
    emailService.sendWelcomeEmail(user).catch(console.error);
    emailService.sendVerificationEmail(user, verificationToken).catch(console.error);

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 201, 'Account created successfully. You can complete your profile and verify your email later.', {
      accessToken,
      refreshToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) return sendError(res, 401, 'Invalid email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 401, 'Invalid email or password');

    if (!user.isActive) return sendError(res, 401, 'Your account has been deactivated. Please contact support.');

    // Update last login
    user.lastLogin = new Date();
    const refreshToken = signRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const accessToken = signAccessToken(user._id);

    return sendSuccess(res, 200, 'Login successful', {
      accessToken,
      refreshToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    }
    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 401, 'Refresh token required');

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return sendError(res, 401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, 401, 'Invalid refresh token');
    }

    const accessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Token refreshed', { accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond the same way to prevent email enumeration
    if (!user) return sendSuccess(res, 200, 'If an account with this email exists, a reset link has been sent.');

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
      return sendSuccess(res, 200, 'Password reset email sent successfully');
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return sendError(res, 500, 'Failed to send reset email. Please try again.');
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const hashedToken = hashToken(req.params.token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) return sendError(res, 400, 'Password reset token is invalid or has expired');

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    return sendTokens(res, user, 200, 'Password reset successfully');
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = hashToken(req.params.token);
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) return sendError(res, 400, 'Email verification token is invalid or has expired');

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Email verified successfully');
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+emailVerificationToken +emailVerificationExpires');
    if (user.isEmailVerified) return sendError(res, 400, 'Email is already verified');

    const token = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    await emailService.sendVerificationEmail(user, token);
    return sendSuccess(res, 200, 'Verification email sent');
  } catch (err) {
    next(err);
  }
};
