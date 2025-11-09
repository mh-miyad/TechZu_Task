import asyncHandler from 'express-async-handler';
import { authService } from '../services/authService.js';

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userData = await authService.registerUser(username, email, password);
    res.status(201).json(userData);
  } catch (error) {
    res.status(400); // Bad Request
    throw error; // Let asyncHandler handle it
  }
});

/**
 * @desc Auth user & get token (Login)
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await authService.loginUser(email, password);
    res.json(userData);
  } catch (error) {
    res.status(401); // Unauthorized
    throw error;
  }
});

export { registerUser, loginUser };
