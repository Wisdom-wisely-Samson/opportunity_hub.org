const express = require('express');
const router = express.Router();
const appController = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { documentUpload } = require('../middleware/upload');
const { createApplicationValidator, updateStatusValidator } = require('../validators/applicationValidator');

router.use(protect);

router.post('/', authorize('refugee'), documentUpload.single('cv'), createApplicationValidator, appController.createApplication);
router.get('/', appController.getApplications);
router.get('/:id', appController.getApplicationById);
router.put('/:id/status', authorize('organization', 'admin'), updateStatusValidator, appController.updateApplicationStatus);
router.delete('/:id', authorize('refugee'), appController.withdrawApplication);

module.exports = router;
