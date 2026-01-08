const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middlewares/auth');
const { secretaryOnly } = require('../middlewares/rbac');
const { handleValidationErrors } = require('../middlewares/validation');
const {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  payBill,
  getOverdueBills,
  getBillSummary
} = require('../controllers/billController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all bills (with pagination and filters)
router.get('/', getAllBills);

// Get bill summary for dashboard
router.get('/summary', getBillSummary);

// Get overdue bills
router.get('/overdue', getOverdueBills);

// Get bill by ID
router.get('/:id', getBillById);

// Create new bill (Secretary only)
router.post('/', [
  secretaryOnly,
  body('flatId')
    .notEmpty()
    .withMessage('Flat ID is required'),
  body('billType')
    .isIn(['RENT', 'ELECTRICITY', 'WATER', 'MAINTENANCE', 'PARKING', 'PENALTY'])
    .withMessage('Invalid bill type'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  handleValidationErrors
], createBill);

// Update bill (Secretary only)
router.put('/:id', [
  secretaryOnly,
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('status')
    .optional()
    .isIn(['DUE', 'PAID', 'OVERDUE'])
    .withMessage('Invalid status'),
  handleValidationErrors
], updateBill);

// Pay bill (Users can pay their own bills, Secretary can pay any bill)
router.patch('/:id/pay', [
  body('paymentMethod')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Payment method must be between 1-100 characters'),
  body('transactionId')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Transaction ID must be between 1-100 characters'),
  handleValidationErrors
], payBill);

module.exports = router;