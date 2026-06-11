const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organizationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { imageUpload } = require('../middleware/upload');
const { updateOrgProfileValidator } = require('../validators/userValidator');
const { uploadLimiter } = require('../middleware/rateLimiter');

router.get('/', orgController.getAllOrganizations);
router.get('/:id', orgController.getOrganizationById);

router.use(protect);
router.get('/my/profile', authorize('organization'), orgController.getMyOrganizationProfile);
router.get('/my/dashboard', authorize('organization'), orgController.getDashboardStats);
router.post('/profile', authorize('organization'), orgController.createOrganizationProfile);
router.put('/profile', authorize('organization'), updateOrgProfileValidator, orgController.updateOrganizationProfile);
router.post('/upload-logo', authorize('organization'), uploadLimiter, imageUpload.single('logo'), orgController.uploadLogo);

module.exports = router;
