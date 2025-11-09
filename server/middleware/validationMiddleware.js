import { validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

/**
 * Middleware that runs validation checks.
 * If errors are found, it stops the request and sends a 400 response
 * with a list of errors.
 */
const handleValidationErrors = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
});

export { handleValidationErrors };
