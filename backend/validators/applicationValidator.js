const { body } = require('express-validator');

const createApplicationValidator = [
  body('opportunityId').isMongoId().withMessage('Invalid opportunity ID'),
  body('coverLetter').optional().trim().isLength({ max: 2000 }).withMessage('Cover letter cannot exceed 2000 characters'),
];

const updateStatusValidator = [
  body('status').isIn(['reviewed', 'accepted', 'rejected']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 }),
];

module.exports = { createApplicationValidator, updateStatusValidator };
