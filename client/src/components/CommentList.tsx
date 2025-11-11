import { useCallback, useEffect, useState } from "react";
import { commentService } from "../api/commentService";
import { useNotification } from "../context/NotificationContext";
import { useSocket } from "../hooks/useSocket";
import type { Comment, SortOption } from "../types";
import { AddComment } from "./AddComment";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  postSlug: string;
}

export const CommentList = ({ postSlug }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { addNotification } = useNotification();

  const handleUpdateCommentInList = (updatedComment: Comment) => {
    setComments((prevComments) =>
      prevComments.map((c) =>
        c._id === updatedComment._id ? updatedComment : c
      )
    );
  };

  const handleAddCommentToList = (newComment: Comment) => {
    // Add new top-level comments to the top of the list
    if (!newComment.parentId) {
      setComments((prevComments) => [newComment, ...prevComments]);
    }
    // For replies, a full reload is simpler for now
    else {
      loadComments();
    }
  };

  const handleRemoveCommentFromList = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((c) => c._id !== commentId)
    );
  };

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getComments(postSlug, page, 10, sortBy);
      setComments(data.comments);
      setTotalPages(data.page);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [postSlug, page, sortBy]);

  useSocket(postSlug, {
    onCommentCreated: () => {
      addNotification("info", "New comment arrived");
      loadComments(); // Socket reload is fine
    },
    onCommentUpdated: () => loadComments(),
    onCommentDeleted: () => loadComments(),
    onCommentLiked: () => loadComments(),
    onCommentDisliked: () => loadComments(),
  });

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
  };

  return (
    <div className="comments-container">
      <div className="comments-header">
        <h1>Comments</h1>
      </div>

      <AddComment
        postSlug={postSlug}
        onCommentCreated={handleAddCommentToList}
      />

      <div className="comments-controls">
        <div className="sort-control">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setPage(1);
            }}
          >
            <option value="newest">Newest</option>
            <option value="mostLiked">Most Liked</option>
            <option value="mostDisliked">Most Disliked</option>
          </select>
        </div>
        <div className="comments-count">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </div>
      </div>

      {error && !loading && <div className="form-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div>
            <div className="spinner"></div>
            <p style={{ marginTop: "1rem", color: "#64748b" }}>
              Loading comments...
            </p>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="empty-state">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <>
          <div>
            {comments.map((comment) => (
              <div key={comment._id}>
                <CommentItem
                  comment={comment}
                  onCommentUpdated={handleUpdateCommentInList}
                  onCommentDeleted={handleRemoveCommentFromList}
                  onReply={handleReply}
                />
                {replyingTo === comment._id && (
                  <div className="comment-replies">
                    <AddComment
                      postSlug={postSlug}
                      parentId={comment._id}
                      onCommentCreated={() => {
                        setReplyingTo(null);
                        loadComments(); // Reload to show new reply
                      }}
                      onCancel={() => setReplyingTo(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-primary"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-primary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
