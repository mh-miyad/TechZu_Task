import { body } from 'express-validator';

/**
 * Validation rules for user registration.
 */
const registerRules = [
  body('username', 'Username is required').notEmpty().trim().escape(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
];

/**
 * Validation rules for user login.
 */
const loginRules = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
];

export { registerRules, loginRules };
