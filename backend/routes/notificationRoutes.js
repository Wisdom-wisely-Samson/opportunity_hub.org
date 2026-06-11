const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', notifController.getNotifications);
router.put('/read-all', notifController.markAllAsRead);
router.put('/:id/read', notifController.markAsRead);
router.delete('/:id', notifController.deleteNotification);

module.exports = router;
