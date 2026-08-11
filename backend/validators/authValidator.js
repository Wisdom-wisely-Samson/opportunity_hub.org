const { body } = require('express-validator');

const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain a lowercase letter')
    .custom((value) => {
      if (!value || value[0] !== value[0].toUpperCase()) {
        throw new Error('Password must start with an uppercase letter');
      }
      return true;
    })
    .matches(/(?=.*\d)/).withMessage('Password must contain a number'),
  body('role').optional().isIn(['refugee', 'organization']).withMessage('Invalid role'),
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

const resetPasswordValidator = [
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain a lowercase letter')
    .custom((value) => {
      if (!value || value[0] !== value[0].toUpperCase()) {
        throw new Error('Password must start with an uppercase letter');
      }
      return true;
    })
    .matches(/(?=.*\d)/).withMessage('Password must contain a number'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain a lowercase letter')
    .custom((value) => {
      if (!value || value[0] !== value[0].toUpperCase()) {
        throw new Error('Password must start with an uppercase letter');
      }
      return true;
    })
    .matches(/(?=.*\d)/).withMessage('Password must contain a number'),
];

module.exports = { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, changePasswordValidator };
