const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const { handleValidationErrors } = require('../middlewares/validation');
const {
  getAllVisitorLogs,
  getVisitorLogById,
  createVisitorEntry,
  updateVisitorStatus,
  recordVisitorCheckIn,
  recordVisitorExit,
  getPendingApprovals
} = require('../controllers/visitorController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all visitor logs
router.get('/', getAllVisitorLogs);

// Get pending approvals for current user
router.get('/pending', getPendingApprovals);

// Get visitor log by ID
router.get('/:id', getVisitorLogById);

// Create visitor entry (Guard only)
router.post('/', [
  requireRole('GUARD'),
  body('visitorName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Visitor name must be between 2-100 characters'),
  body('visitorPhone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  body('flatId')
    .notEmpty()
    .withMessage('Flat ID is required'),
  body('purpose')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Purpose must be between 2-200 characters'),
  body('vehicleNumber')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Vehicle number must be less than 20 characters'),
  body('idProofType')
    .optional()
    .isIn(['AADHAR', 'PAN', 'DRIVING_LICENSE', 'PASSPORT', 'VOTER_ID'])
    .withMessage('Invalid ID proof type'),
  body('idProofNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('ID proof number must be less than 50 characters'),
  handleValidationErrors
], createVisitorEntry);

// Approve/Reject visitor (Owner/Tenant)
router.patch('/:id/status', [
  requireRole('OWNER', 'TENANT'),
  body('isApproved')
    .isBoolean()
    .withMessage('isApproved must be true or false'),
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason must be less than 500 characters'),
  handleValidationErrors
], updateVisitorStatus);

// Record visitor check-in (Guard only)
router.patch('/:id/checkin', [
  requireRole('GUARD'),
  handleValidationErrors
], recordVisitorCheckIn);

// Record visitor exit (Guard only)
router.patch('/:id/exit', [
  requireRole('GUARD'),
  handleValidationErrors
], recordVisitorExit);

module.exports = router;