import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

/**
 * Gets comments for a post with sorting and pagination.
 */
const getCommentsForPost = async (postSlug, sortBy, page, limit) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const query = { postSlug, parentId: null };
  let sortOptions = {};

  switch (sortBy) {
    case 'mostLiked':
    case 'mostDisliked':
      // Aggregation is needed
      break;
    case 'newest':
    default:
      sortOptions = { createdAt: -1 };
      break;
  }

  let comments;
  let totalComments;

  if (sortBy === 'mostLiked' || sortBy === 'mostDisliked') {
    const aggregation = [
      { $match: query },
      {
        $addFields: {
          likeCount: { $size: '$likes' },
          dislikeCount: { $size: '$dislikes' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      { $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
      { $addFields: { author: '$authorDetails' } },
      { $project: { authorDetails: 0 } },
    ];

    if (sortBy === 'mostLiked') {
      aggregation.push({ $sort: { likeCount: -1, createdAt: -1 } });
    } else {
      aggregation.push({ $sort: { dislikeCount: -1, createdAt: -1 } });
    }

    const countPipeline = [...aggregation, { $count: 'total' }];
    const totalResult = await Comment.aggregate(countPipeline);
    totalComments = totalResult[0] ? totalResult[0].total : 0;

    aggregation.push({ $skip: skip });
    aggregation.push({ $limit: limitNum });

    comments = await Comment.aggregate(aggregation);

  } else {
    totalComments = await Comment.countDocuments(query);
    comments = await Comment.find(query)
      .populate('author', 'username avatarUrl')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
  }

  const totalPages = Math.ceil(totalComments / limitNum);
  return { comments, currentPage: pageNum, totalPages, totalComments };
};

/**
 * Creates a new comment.
 */
const createNewComment = async (authorId, content, postSlug, parentId) => {
  const comment = new Comment({
    content,
    postSlug,
    parentId: parentId || null,
    author: authorId,
  });

  const createdComment = await comment.save();
  await createdComment.populate('author', 'username avatarUrl');
  return createdComment;
};

/**
 * Finds and updates a comment, checking for author ownership.
 */
const updateComment = async (commentId, userId, content) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw { status: 404, message: 'Comment not found' };
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw { status: 404, message: 'Comment not found' };
  }

  if (comment.author.toString() !== userId.toString()) {
    throw { status: 401, message: 'User not authorized' };
  }

  comment.content = content;
  const updatedComment = await comment.save();
  await updatedComment.populate('author', 'username avatarUrl');
  return updatedComment;
};

/**
 * Finds and deletes a comment, checking for author ownership.
 * Also deletes all replies to that comment.
 */
const deleteComment = async (commentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw { status: 404, message: 'Comment not found' };
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw { status: 404, message: 'Comment not found' };
  }

  if (comment.author.toString() !== userId.toString()) {
    throw { status: 401, message: 'User not authorized' };
  }

  // Delete replies first
  await Comment.deleteMany({ parentId: commentId });
  // Delete the main comment
  await comment.deleteOne();

  return { message: 'Comment and replies removed' };
};

/**
 * Toggles a 'like' on a comment.
 * Removes dislike if it exists.
 */
const toggleLike = async (commentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw { status: 404, message: 'Comment not found' };
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw { status: 404, message: 'Comment not found' };
  }

  // 1. Remove from dislikes
  comment.dislikes.pull(userId);

  // 2. Toggle in likes
  const hasLiked = comment.likes.includes(userId);
  if (hasLiked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.addToSet(userId);
  }

  await comment.save();
  await comment.populate('author', 'username avatarUrl');
  return comment;
};

/**
 * Toggles a 'dislike' on a comment.
 * Removes like if it exists.
 */
const toggleDislike = async (commentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw { status: 404, message: 'Comment not found' };
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw { status: 404, message: 'Comment not found' };
  }

  // 1. Remove from likes
  comment.likes.pull(userId);

  // 2. Toggle in dislikes
  const hasDisliked = comment.dislikes.includes(userId);
  if (hasDisliked) {
    comment.dislikes.pull(userId);
  } else {
    comment.dislikes.addToSet(userId);
  }

  await comment.save();
  await comment.populate('author', 'username avatarUrl');
  return comment;
};

/**
 * Gets all replies for a single parent comment.
 */
const getCommentReplies = async (parentId) => {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw { status: 404, message: 'Comment not found' };
  }

  const replies = await Comment.find({ parentId })
    .populate('author', 'username avatarUrl')
    .sort({ createdAt: 1 });

  return replies;
};

export const commentService = {
  getCommentsForPost,
  createNewComment,
  updateComment,
  deleteComment,
  toggleLike,
  toggleDislike,
  getCommentReplies,
};
