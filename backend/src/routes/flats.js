const express = require('express');
const {
  getAllFlats,
  getFlatById,
  createFlat,
  updateFlat,
  deleteFlat,
  getFlatsByOwner
} = require('../controllers/flatController');
const { authenticateToken } = require('../middlewares/auth');
const { secretaryOnly, ownerOrSecretary, requireRole } = require('../middlewares/rbac');
const {
  validateId,
  validateFlatNumber,
  validatePagination,
  handleValidationErrors
} = require('../middlewares/validation');
const { body } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all flats (Secretary can see all, Owner/Tenant see their own)
router.get('/', [
  requireRole('OWNER', 'TENANT', 'SECRETARY'),
  ...validatePagination(),
  handleValidationErrors
], getAllFlats);

// Get flats by owner
router.get('/owner/:ownerId?', [
  ownerOrSecretary,
  handleValidationErrors
], getFlatsByOwner);

// Get flat by ID
router.get('/:id', [
  ownerOrSecretary,
  validateId(),
  handleValidationErrors
], getFlatById);

// Create new flat (Secretary only)
router.post('/', [
  secretaryOnly,
  validateFlatNumber(),
  body('floor')
    .isInt({ min: 0 })
    .withMessage('Floor must be a non-negative integer'),
  body('bedrooms')
    .isInt({ min: 1 })
    .withMessage('Bedrooms must be at least 1'),
  body('bathrooms')
    .isInt({ min: 1 })
    .withMessage('Bathrooms must be at least 1'),
  body('area')
    .isFloat({ min: 1 })
    .withMessage('Area must be a positive number'),
  body('ownerId')
    .notEmpty()
    .withMessage('Owner ID is required'),
  handleValidationErrors
], createFlat);

// Update flat (Secretary only)
router.put('/:id', [
  secretaryOnly,
  validateId(),
  validateFlatNumber(),
  body('floor')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Floor must be a non-negative integer'),
  body('bedrooms')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Bedrooms must be at least 1'),
  body('bathrooms')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Bathrooms must be at least 1'),
  body('area')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Area must be a positive number'),
  body('ownerId')
    .optional()
    .notEmpty()
    .withMessage('Owner ID cannot be empty'),
  handleValidationErrors
], updateFlat);

// Delete flat (Secretary only)
router.delete('/:id', [
  secretaryOnly,
  validateId(),
  handleValidationErrors
], deleteFlat);

module.exports = router;