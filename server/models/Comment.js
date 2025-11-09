import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    // Identifies what page/post the comment belongs to.
    // In a real app, this might be a ref to a 'Post' model.
    postSlug: {
      type: String,
      required: true,
      index: true, // Add index for faster queries
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the User model
    },
    // For comment replies (optional feature)
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // Top-level comments have null parentId
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // --- New Feature: Sentiment Analysis ---
    sentimentScore: {
      type: Number,
      default: 0,
      index: true, // Add index for sorting
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// --- Virtuals (for efficient sorting) ---
// These aren't stored in the DB, but are calculated on query.

// Virtual for like count
commentSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Virtual for dislike count
commentSchema.virtual('dislikeCount').get(function () {
  return this.dislikes.length;
});

// Ensure virtuals are included when converting to JSON (e.g., for API responses)
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
