const { body } = require('express-validator');

const createOpportunityValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('category').isIn(['job', 'scholarship', 'grant', 'training', 'internship', 'fellowship', 'entrepreneurship']).withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('deadline').isISO8601().withMessage('Invalid deadline date').custom((value) => {
    if (new Date(value) <= new Date()) throw new Error('Deadline must be in the future');
    return true;
  }),
  body('requirements').optional().isArray(),
  body('benefits').optional().isArray(),
  body('tags').optional().isArray(),
];

const updateOpportunityValidator = [
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('category').optional().isIn(['job', 'scholarship', 'grant', 'training', 'internship', 'fellowship', 'entrepreneurship']),
  body('status').optional().isIn(['active', 'closed', 'draft', 'expired']),
  body('deadline').optional().isISO8601(),
];

module.exports = { createOpportunityValidator, updateOpportunityValidator };
