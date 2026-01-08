const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middlewares/auth');
const { secretaryOnly, residentOnly, staffOrSecretary } = require('../middlewares/rbac');
const { handleValidationErrors } = require('../middlewares/validation');
const {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  assignIssue,
  getIssueStats
} = require('../controllers/issueController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all issues
router.get('/', getAllIssues);

// Get issue statistics
router.get('/stats', getIssueStats);

// Get issue by ID
router.get('/:id', getIssueById);

// Create issue (Owner/Tenant)
router.post('/', [
  residentOnly,
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5-200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10-2000 characters'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2-50 characters'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority level'),
  handleValidationErrors
], createIssue);

// Update issue
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5-200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10-2000 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2-50 characters'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority level'),
  body('status')
    .optional()
    .isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
    .withMessage('Invalid status'),
  body('assignedToId')
    .optional()
    .isString()
    .withMessage('Assigned to ID must be a string'),
  body('resolution')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Resolution must be less than 1000 characters'),
  handleValidationErrors
], updateIssue);

// Assign issue to staff (Secretary only)
router.patch('/:id/assign', [
  secretaryOnly,
  body('assignedToId')
    .notEmpty()
    .withMessage('Assigned to ID is required'),
  handleValidationErrors
], assignIssue);

// Delete issue
router.delete('/:id', deleteIssue);

module.exports = router;