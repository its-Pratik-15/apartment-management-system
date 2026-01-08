const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Common validation rules
const validateEmail = () => 
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address');

const validatePassword = () =>
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

const validateName = (field) =>
  body(field)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(`${field} must be between 2 and 50 characters`)
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage(`${field} must contain only letters and spaces`);

const validatePhone = () =>
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number');

const validateRole = () =>
  body('role')
    .isIn(['OWNER', 'TENANT', 'SECRETARY', 'STAFF', 'GUARD'])
    .withMessage('Invalid role specified');

const validateId = (field = 'id') =>
  param(field)
    .isString()
    .isLength({ min: 1 })
    .withMessage(`${field} is required`);

const validateFlatNumber = () =>
  body('flatNumber')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Flat number is required and must be less than 10 characters')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('Flat number must contain only letters and numbers');

const validateAmount = (field) =>
  body(field)
    .isFloat({ min: 0 })
    .withMessage(`${field} must be a positive number`);

const validateDate = (field) =>
  body(field)
    .isISO8601()
    .withMessage(`${field} must be a valid date`);

const validateBillType = () =>
  body('billType')
    .isIn(['RENT', 'ELECTRICITY', 'WATER', 'MAINTENANCE', 'PARKING', 'PENALTY'])
    .withMessage('Invalid bill type');

const validatePriority = () =>
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority level');

// Pagination validation
const validatePagination = () => [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

module.exports = {
  handleValidationErrors,
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRole,
  validateId,
  validateFlatNumber,
  validateAmount,
  validateDate,
  validateBillType,
  validatePriority,
  validatePagination
};