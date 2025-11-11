import { useState, type FormEvent } from "react";
import { commentService } from "../api/commentService";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../types";

interface AddCommentProps {
  postSlug: string;
  parentId?: string;
  onCommentCreated: (newComment: Comment) => void;
  onCancel?: () => void;
}

export const AddComment = ({
  postSlug,
  parentId,
  onCommentCreated,
  onCancel,
}: AddCommentProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError("");

    try {
      const newComment = await commentService.createComment(
        postSlug,
        content,
        parentId
      );
      setContent("");
      onCommentCreated(newComment);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning">
        <p>Please login to add comments</p>
      </div>
    );
  }

  return (
    <div className="comment-form">
      <h3>{parentId ? "Add Reply" : "Add Comment"}</h3>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment..."
            className="form-textarea"
            required
            maxLength={2000}
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="btn btn-primary"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
