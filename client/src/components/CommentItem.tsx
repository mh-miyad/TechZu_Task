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
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-semibold text-gray-900">
            {comment.author.name}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        {isOwner && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 mb-3">{comment.content}</p>
      )}

      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={handleLike}
          disabled={!isAuthenticated || loading}
          className={`flex items-center gap-1 ${
            hasLiked ? "text-blue-600" : "text-gray-600"
          } hover:text-blue-600 disabled:cursor-not-allowed`}
        >
          <span>👍</span>
          <span>{comment.likeCount}</span>
        </button>

        <button
          onClick={handleDislike}
          disabled={!isAuthenticated || loading}
          className={`flex items-center gap-1 ${
            hasDisliked ? "text-red-600" : "text-gray-600"
          } hover:text-red-600 disabled:cursor-not-allowed`}
        >
          <span>👎</span>
          <span>{comment.dislikeCount}</span>
        </button>

        {onReply && isAuthenticated && (
          <button
            onClick={() => onReply(comment._id)}
            className="text-gray-600 hover:text-blue-600"
          >
            Reply
          </button>
        )}

        <button
          onClick={loadReplies}
          className="text-gray-600 hover:text-blue-600"
        >
          {showReplies ? "Hide Replies" : "Show Replies"}
        </button>
      </div>

      {showReplies && replies.length > 0 && (
        <div className="ml-8 mt-4 space-y-3">
          {replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};
