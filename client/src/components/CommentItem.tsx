import { useState } from "react";
import { FaEdit, FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";
import { commentService } from "../api/commentService";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../types";
import { CommentList } from "./CommentList";

interface CommentItemProps {
  comment: Comment;
  onCommentUpdated: (updatedComment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
  onReply?: (parentId: string) => void;
}

export const CommentItem = ({
  comment,
  onCommentUpdated,
  onCommentDeleted,
  onReply,
}: CommentItemProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const isOwner = user?._id === comment.author._id;
  const hasLiked = isAuthenticated && comment.likes.includes(user!._id);
  const hasDisliked = isAuthenticated && comment.dislikes.includes(user!._id);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      const updatedComment = await commentService.likeComment(comment._id);
      onCommentUpdated(updatedComment);
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) return;
    try {
      const updatedComment = await commentService.dislikeComment(comment._id);
      onCommentUpdated(updatedComment);
    } catch (err) {
      console.error("Failed to dislike comment", err);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedComment = await commentService.updateComment(
        comment._id,
        editContent
      );
      onCommentUpdated(updatedComment);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    setLoading(true);
    try {
      await commentService.deleteComment(comment._id);
      onCommentDeleted(comment._id);
    } catch (err) {
      console.error("Failed to delete comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-item-header">
        <div className="comment-item-author">
          <span className="author-name">{comment.author.username}</span>
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        {isOwner && !isEditing && (
          <div className="comment-item-actions">
            <button onClick={() => setIsEditing(true)} className="btn-icon">
              <FaEdit />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn-icon btn-icon-danger"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div>
          <div className="form-group">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="form-textarea"
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="btn btn-primary btn-small"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="btn btn-secondary btn-small"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="comment-item-content">{comment.content}</p>
      )}

      <div className="comment-item-footer">
        <button
          onClick={handleLike}
          disabled={!isAuthenticated || loading}
          className={`comment-item-reaction ${hasLiked ? "active-like" : ""}`}
        >
          <span className="icon">
            <FaThumbsUp />
          </span>
          <span>{comment.likeCount}</span>
        </button>

        <button
          onClick={handleDislike}
          disabled={!isAuthenticated || loading}
          className={`comment-item-reaction ${
            hasDisliked ? "active-dislike" : ""
          }`}
        >
          <span className="icon">
            <FaThumbsDown />
          </span>
          <span>{comment.dislikeCount}</span>
        </button>

        {onReply && isAuthenticated && (
          <button
            onClick={() => onReply(comment._id)}
            className="comment-item-reply-btn"
          >
            Reply
          </button>
        )}

        {/* For simplicity, replies are fetched on demand and not managed in the main state */}
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="comment-item-reply-btn"
        >
          {showReplies ? "Hide Replies" : `View Replies `}
        </button>
      </div>

      {showReplies && (
        <div className="comment-replies">
          <CommentList postSlug={comment.postSlug} />
        </div>
      )}
    </div>
  );
};
