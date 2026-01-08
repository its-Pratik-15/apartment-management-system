const express = require('express');
const { getAlerts } = require('../controllers/alertController');
const { authenticateToken } = require('../middlewares/auth');
const { secretaryOnly } = require('../middlewares/rbac');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all alerts (Secretary only)
router.get('/', secretaryOnly, getAlerts);

module.exports = router;