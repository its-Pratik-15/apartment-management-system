const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middlewares/auth');
const { secretaryOnly } = require('../middlewares/rbac');
const { handleValidationErrors } = require('../middlewares/validation');
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePinStatus,
  getPinnedNotices
} = require('../controllers/noticeController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all notices
router.get('/', getAllNotices);

// Get pinned notices
router.get('/pinned', getPinnedNotices);

// Get notice by ID
router.get('/:id', getNoticeById);

// Create notice (Secretary only)
router.post('/', [
  secretaryOnly,
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5-200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10-5000 characters'),
  body('targetRoles')
    .optional()
    .isArray()
    .withMessage('Target roles must be an array'),
  body('targetRoles.*')
    .optional()
    .isIn(['OWNER', 'TENANT', 'SECRETARY', 'STAFF', 'GUARD', 'ALL'])
    .withMessage('Invalid target role'),
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean'),
  body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid date'),
  handleValidationErrors
], createNotice);

// Update notice (Secretary only)
router.put('/:id', [
  secretaryOnly,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5-200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10-5000 characters'),
  body('targetRoles')
    .optional()
    .isArray()
    .withMessage('Target roles must be an array'),
  body('targetRoles.*')
    .optional()
    .isIn(['OWNER', 'TENANT', 'SECRETARY', 'STAFF', 'GUARD', 'ALL'])
    .withMessage('Invalid target role'),
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean'),
  body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid date'),
  handleValidationErrors
], updateNotice);

// Toggle pin status (Secretary only)
router.patch('/:id/pin', [
  secretaryOnly,
  handleValidationErrors
], togglePinStatus);

// Delete notice (Secretary only)
router.delete('/:id', [
  secretaryOnly,
  handleValidationErrors
], deleteNotice);

module.exports = router;