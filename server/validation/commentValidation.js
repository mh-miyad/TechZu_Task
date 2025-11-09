import { body } from 'express-validator';

/**
 * Validation rules for creating a new comment.
 */
const createCommentRules = [
  body('content', 'Comment content is required')
    .notEmpty()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Comment cannot be more than 2000 characters')
    .escape(),
  body('postSlug', 'postSlug is required').notEmpty().trim().escape(),
];

/**
 * Validation rules for updating a comment.
 */
const updateCommentRules = [
  body('content', 'Comment content is required')
    .notEmpty()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Comment cannot be more than 2000 characters')
    .escape(),
];

export { createCommentRules, updateCommentRules };
