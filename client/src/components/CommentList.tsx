import { useEffect, useState } from "react";
import { commentService } from "../api/commentService";
import type { Comment, SortOption } from "../types";
import { AddComment } from "./AddComment";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  postSlug: string;
}

export const CommentList = ({ postSlug }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await commentService.getComments(postSlug, page, 10, sortBy);
      setComments(data.comments);
      setTotalPages(data.pages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postSlug, page, sortBy]);

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Comments</h1>

      <AddComment postSlug={postSlug} onSuccess={loadComments} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="mostLiked">Most Liked</option>
            <option value="mostDisliked">Most Disliked</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id}>
                <CommentItem
                  comment={comment}
                  onUpdate={loadComments}
                  onReply={handleReply}
                />
                {replyingTo === comment._id && (
                  <div className="ml-8 mt-2">
                    <AddComment
                      postSlug={postSlug}
                      parentId={comment._id}
                      onSuccess={() => {
                        setReplyingTo(null);
                        loadComments();
                      }}
                      onCancel={() => setReplyingTo(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
