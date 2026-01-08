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
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
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