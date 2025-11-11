import asyncHandler from 'express-async-handler';
import { commentService } from '../services/commentService.js';

/**
 * A helper function to safely emit Socket.IO events.
 * It checks if the 'io' object exists on the request before attempting to use it.
 * This prevents crashes in production environments where Socket.IO is not initialized.
 * @param {object} req - The Express request object.
 * @param {string} room - The Socket.IO room to emit to (e.g., a postSlug).
 * @param {string} event - The name of the event to emit.
 * @param {object} data - The payload to send with the event.
 */
const safeSocketEmit = (req, room, event, data) => {
  const io = req.app.get('io');
  if (io && room) {
    io.to(room).emit(event, data);
  }
};

const handleServiceError = (error, res) => {
  res.status(error.status || 400);
  throw new Error(error.message);
};

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
    safeSocketEmit(req, postSlug, 'commentCreated', createdComment);
    res.status(201).json(createdComment);
  } catch (error) {
    handleServiceError(error, res);
  }
});

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
    safeSocketEmit(
      req,
      updatedComment.postSlug,
      'commentUpdated',
      updatedComment
    );
    res.json(updatedComment);
  } catch (error) {
    handleServiceError(error, res);
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const result = await commentService.deleteComment(id, userId);
    safeSocketEmit(req, result.postSlug, 'commentDeleted', {
      commentId: id,
      postSlug: result.postSlug,
    });
    res.json(result);
  } catch (error) {
    handleServiceError(error, res);
  }
});

const likeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const updatedComment = await commentService.toggleLike(id, userId);
    safeSocketEmit(
      req,
      updatedComment.postSlug,
      'commentLiked',
      updatedComment
    );
    res.json(updatedComment);
  } catch (error) {
    handleServiceError(error, res);
  }
});

const dislikeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const updatedComment = await commentService.toggleDislike(id, userId);
    safeSocketEmit(
      req,
      updatedComment.postSlug,
      'commentDisliked',
      updatedComment
    );
    res.json(updatedComment);
  } catch (error) {
    handleServiceError(error, res);
  }
});

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