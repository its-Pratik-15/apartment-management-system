const express = require('express');
const {
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
  terminateLease,
  getExpiringLeases
} = require('../controllers/leaseController');
const { authenticateToken } = require('../middlewares/auth');
const { secretaryOnly, ownerOrSecretary } = require('../middlewares/rbac');
const {
  validateId,
  validateDate,
  validateAmount,
  validatePagination,
  handleValidationErrors
} = require('../middlewares/validation');
const { body, query } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get expiring leases (Secretary only)
router.get('/expiring', [
  secretaryOnly,
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365'),
  handleValidationErrors
], getExpiringLeases);

// Get all leases (Secretary only)
router.get('/', [
  secretaryOnly,
  ...validatePagination(),
  handleValidationErrors
], getAllLeases);

// Get lease by ID
router.get('/:id', [
  ownerOrSecretary,
  validateId(),
  handleValidationErrors
], getLeaseById);

// Create new lease (Secretary only)
router.post('/', [
  secretaryOnly,
  body('flatId')
    .notEmpty()
    .withMessage('Flat ID is required'),
  body('tenantId')
    .notEmpty()
    .withMessage('Tenant ID is required'),
  validateDate('startDate'),
  validateDate('endDate'),
  validateAmount('monthlyRent'),
  body('securityDeposit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Security deposit must be a positive number'),
  handleValidationErrors
], createLease);

// Update lease (Secretary only)
router.put('/:id', [
  secretaryOnly,
  validateId(),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('monthlyRent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly rent must be a positive number'),
  body('securityDeposit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Security deposit must be a positive number'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors
], updateLease);

// Terminate lease (Secretary only)
router.put('/:id/terminate', [
  secretaryOnly,
  validateId(),
  body('terminationDate')
    .optional()
    .isISO8601()
    .withMessage('Termination date must be a valid date'),
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason must be less than 500 characters'),
  handleValidationErrors
], terminateLease);

module.exports = router;