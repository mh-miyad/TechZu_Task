import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getReplies,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createCommentRules,
  updateCommentRules,
} from '../validation/commentValidation.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// --- Public Routes ---

// GET /api/comments/:postSlug
router.get('/:postSlug', getComments);

// GET /api/comments/:id/replies
router.get('/:id/replies', getReplies);

// --- Private Routes (Require Authentication) ---

// POST /api/comments
router.post(
  '/',
  protect,
  createCommentRules,
  handleValidationErrors,
  createComment
);

// PUT /api/comments/:id
router.put(
  '/:id',
  protect,
  updateCommentRules,
  handleValidationErrors,
  updateComment
);

// DELETE /api/comments/:id
router.delete('/:id', protect, deleteComment);

// POST /api/comments/:id/like
router.post('/:id/like', protect, likeComment);

// POST /api/comments/:id/dislike
router.post('/:id/dislike', protect, dislikeComment);

export default router;
