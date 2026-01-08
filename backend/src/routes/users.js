const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');
const { secretaryOnly, ownerOrSecretary } = require('../middlewares/rbac');
const {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRole,
  validateId,
  validatePagination,
  handleValidationErrors
} = require('../middlewares/validation');
const { body } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all users (Secretary only)
router.get('/', [
  secretaryOnly,
  ...validatePagination(),
  handleValidationErrors
], getAllUsers);

// Get users by role (Secretary only)
router.get('/role/:role', [
  secretaryOnly,
  handleValidationErrors
], getUsersByRole);

// Get user by ID (Secretary or Owner can view)
router.get('/:id', [
  ownerOrSecretary,
  validateId(),
  handleValidationErrors
], getUserById);

// Create new user (Secretary only)
router.post('/', [
  secretaryOnly,
  validateEmail(),
  validatePassword(),
  validateName('firstName'),
  validateName('lastName'),
  validatePhone(),
  validateRole(),
  handleValidationErrors
], createUser);

// Update user (Secretary only)
router.put('/:id', [
  secretaryOnly,
  validateId(),
  validateName('firstName'),
  validateName('lastName'),
  validatePhone(),
  validateRole(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  handleValidationErrors
], updateUser);

// Delete user (Secretary only)
router.delete('/:id', [
  secretaryOnly,
  validateId(),
  handleValidationErrors
], deleteUser);

module.exports = router;