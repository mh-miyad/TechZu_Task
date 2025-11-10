import { useState } from "react";
import { commentService } from "../api/commentService";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
  onUpdate: () => void;
  onReply?: (parentId: string) => void;
}

export const CommentItem = ({
  comment,
  onUpdate,
  onReply,
}: CommentItemProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);

  const isOwner = user?._id === comment.author._id;
  const hasLiked = isAuthenticated && comment.likes.includes(user!._id);
  const hasDisliked = isAuthenticated && comment.dislikes.includes(user!._id);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      await commentService.likeComment(comment._id);
      onUpdate();
    } catch (err) {
      console.error("Failed to like comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      await commentService.dislikeComment(comment._id);
      onUpdate();
    } catch (err) {
      console.error("Failed to dislike comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      await commentService.updateComment(comment._id, editContent);
      setIsEditing(false);
      onUpdate();
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
      onUpdate();
    } catch (err) {
      console.error("Failed to delete comment", err);
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    try {
      const data = await commentService.getReplies(comment._id);
      setReplies(data);
      setShowReplies(true);
    } catch (err) {
      console.error("Failed to load replies", err);
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
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-link btn-small"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn btn-link btn-small"
              style={{ color: "#ef4444" }}
            >
              Delete
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
          <span className="icon">👍</span>
          <span>{comment.likeCount}</span>
        </button>

        <button
          onClick={handleDislike}
          disabled={!isAuthenticated || loading}
          className={`comment-item-reaction ${hasDisliked ? "active-dislike" : ""}`}
        >
          <span className="icon">👎</span>
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

        <button onClick={loadReplies} className="comment-item-reply-btn">
          {showReplies ? "Hide Replies" : "Show Replies"}
        </button>
      </div>

      {showReplies && replies.length > 0 && (
        <div className="comment-replies">
          {replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};
