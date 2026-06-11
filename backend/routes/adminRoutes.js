const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/reports', adminController.getReports);

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/organizations', adminController.getOrganizations);
router.put('/organizations/:id/verify', adminController.verifyOrganization);

router.get('/opportunities', adminController.adminGetOpportunities);
router.put('/opportunities/:id/status', adminController.updateOpportunityStatus);
router.delete('/opportunities/:id', adminController.adminDeleteOpportunity);

module.exports = router;
