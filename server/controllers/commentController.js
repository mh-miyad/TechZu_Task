import asyncHandler from 'express-async-handler';
import { commentService } from '../services/commentService.js';
import mongoose from 'mongoose';

/**
 * Custom error handler for services
 * Throws errors with specific status codes
 */
const handleServiceError = (error, res) => {
  if (error.status) {
    res.status(error.status);
  } else {
    // Default to 400 for business logic errors
    res.status(400);
  }
  throw new Error(error.message);
};

/**
 * @desc Get all comments for a post (with sorting & pagination)
 * @route GET /api/comments/:postSlug
 * @access Public
 */
const getComments = asyncHandler(async (req, res) => {
  const { postSlug } = req.params;
  const { sortBy, page, limit } = req.query;

  try {
    const data = await commentService.getCommentsForPost(
      postSlug,
      sortBy,
      page,
      limit
    );
    res.json(data);
  } catch (error) {
    handleServiceError(error, res);
  }
});

/**
 * @desc Create a new comment
 * @route POST /api/comments
 * @access Private
 */
const createComment = asyncHandler(async (req, res) => {
  const { content, postSlug, parentId = null } = req.body;
  const authorId = req.user._id;

  try {
    const createdComment = await commentService.createNewComment(
      authorId,
      content,
      postSlug,
      parentId
    );
    res.status(201).json(createdComment);
  } catch (error) {
    handleServiceError(error, res);
  }
});

/**
 * @desc Update a comment
 * @route PUT /api/comments/:id
 * @access Private
 */
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const updatedComment = await commentService.updateComment(
      id,
      userId,
      content
    );
    res.json(updatedComment);
  } catch (error) {
    handleServiceError(error, res);
  }
});

/**
 * @desc Delete a comment
 * @route DELETE /api/comments/:id
 * @access Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const result = await commentService.deleteComment(id, userId);
    res.json(result);
  } catch (error) {
    handleServiceError(error, res);
  }
});

/**
 * @desc Like a comment
 * @route POST /api/comments/:id/like
 * @access Private
 */
const likeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const updatedComment = await commentService.toggleLike(id, userId);
    res.json(updatedComment);
  } catch (error) {
    handleServiceError(error, res);
  }
});

/**
 * @desc Dislike a comment
 * @route POST /api/comments/:id/dislike
 * @access Private
 */
const dislikeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const updatedComment = await commentService.toggleDislike(id, userId);
    res.json(updatedComment);
  } catch (error) {
    handleServiceError(error, res);
  }
});

/**
 * @desc Get replies for a single comment
 * @route GET /api/comments/:id/replies
 * @access Public
 */
const getReplies = asyncHandler(async (req, res) => {
  const { id: parentId } = req.params;

  try {
    const replies = await commentService.getCommentReplies(parentId);
    res.json(replies);
  } catch (error) {
    handleServiceError(error, res);
  }
});

export {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getReplies,
};
