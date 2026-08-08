const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.post('/visit', siteController.incrementVisitor);
router.get('/metrics', siteController.getMetrics);

module.exports = router;
