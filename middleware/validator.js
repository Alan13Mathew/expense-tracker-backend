const { check } = require('express-validator');

exports.validateExpense = [
  check('description').trim().notEmpty().withMessage('Description is required'),
  check('amount').isNumeric().withMessage('Amount must be a number'),
  check('category').trim().notEmpty().withMessage('Category is required'),
  check('type').isIn(['credit', 'debit']).withMessage('Invalid transaction type')
];

exports.validateAuth = [
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
