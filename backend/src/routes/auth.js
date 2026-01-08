const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');
const {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRole,
  handleValidationErrors
} = require('../middlewares/validation');
const { body } = require('express-validator');

const router = express.Router();

// Public routes
router.post('/register', [
  validateEmail(),
  validatePassword(),
  validateName('firstName'),
  validateName('lastName'),
  validatePhone(),
  validateRole(),
  handleValidationErrors
], register);

router.post('/login', [
  validateEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
], login);

// Protected routes
router.use(authenticateToken);

router.get('/profile', getProfile);

router.put('/profile', [
  validateName('firstName'),
  validateName('lastName'),
  validatePhone(),
  handleValidationErrors
], updateProfile);

router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  validatePassword().withMessage('New password must meet security requirements'),
  body('newPassword').custom((value, { req }) => {
    if (value === req.body.currentPassword) {
      throw new Error('New password must be different from current password');
    }
    return true;
  }),
  handleValidationErrors
], changePassword);

router.post('/logout', logout);

module.exports = router;