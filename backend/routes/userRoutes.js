const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { imageUpload, documentUpload } = require('../middleware/upload');
const { updateProfileValidator } = require('../validators/userValidator');
const { changePasswordValidator } = require('../validators/authValidator');
const { uploadLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidator, userController.updateProfile);
router.post('/upload-avatar', uploadLimiter, imageUpload.single('avatar'), userController.uploadAvatar);
router.post('/upload-cv', uploadLimiter, documentUpload.single('cv'), authorize('refugee'), userController.uploadCV);
router.delete('/cv', authorize('refugee'), userController.deleteCV);
router.put('/change-password', changePasswordValidator, userController.changePassword);
router.delete('/account', userController.deleteAccount);

router.get('/saved-opportunities', authorize('refugee'), userController.getSavedOpportunities);
router.post('/saved-opportunities/:opportunityId', authorize('refugee'), userController.saveOpportunity);
router.delete('/saved-opportunities/:opportunityId', authorize('refugee'), userController.unsaveOpportunity);

router.get('/notifications', userController.getNotifications);
router.put('/notifications/:id/read', userController.markNotificationRead);
router.put('/notifications/read-all', userController.markAllNotificationsRead);

module.exports = router;
