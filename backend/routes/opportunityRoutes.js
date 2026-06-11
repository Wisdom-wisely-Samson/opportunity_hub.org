const express = require('express');
const router = express.Router();
const oppController = require('../controllers/opportunityController');
const { protect, optionalAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { createOpportunityValidator, updateOpportunityValidator } = require('../validators/opportunityValidator');

router.get('/', optionalAuth, oppController.getOpportunities);
router.get('/featured', oppController.getFeaturedOpportunities);
router.get('/categories/stats', oppController.getCategoryStats);
router.get('/:id', optionalAuth, oppController.getOpportunityById);

router.use(protect);
router.post('/', authorize('organization'), createOpportunityValidator, oppController.createOpportunity);
router.put('/:id', authorize('organization', 'admin'), updateOpportunityValidator, oppController.updateOpportunity);
router.delete('/:id', authorize('organization', 'admin'), oppController.deleteOpportunity);

module.exports = router;
