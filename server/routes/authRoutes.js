import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import {
  registerRules,
  loginRules,
} from '../validation/authValidation.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// @route POST /api/auth/register
// Add validation rules. handleValidationErrors will run after rules.
router.post(
  '/register',
  registerRules,
  handleValidationErrors,
  registerUser
);

// @route POST /api/auth/login
router.post('/login', loginRules, handleValidationErrors, loginUser);

export default router;
