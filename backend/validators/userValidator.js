const { body } = require('express-validator');

const updateProfileValidator = [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']),
  body('countryOfOrigin').optional().trim().isLength({ max: 100 }),
  body('currentLocation').optional().trim().isLength({ max: 200 }),
  body('refugeeStatus').optional().isIn(['refugee', 'asylum_seeker', 'internally_displaced', 'stateless', 'returnee', 'other']),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('skills').optional().isArray(),
  body('languages').optional().isArray(),
  body('education').optional().isArray(),
];

const updateOrgProfileValidator = [
  body('organizationName').optional().trim().isLength({ min: 2, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('type').optional().isIn(['ngo', 'employer', 'university', 'training_provider', 'government', 'other']),
  body('website').optional().isURL().withMessage('Please enter a valid website URL'),
  body('contactEmail').optional().isEmail().normalizeEmail(),
];

module.exports = { updateProfileValidator, updateOrgProfileValidator };
