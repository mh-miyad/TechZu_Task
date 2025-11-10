import type { Comment, CommentsResponse, SortOption } from "../types";
import api from "./axios";

export const commentService = {
  getComments: async (
    postSlug: string,
    page: number = 1,
    limit: number = 10,
    sort: SortOption = "newest"
  ): Promise<CommentsResponse> => {
    const { data } = await api.get<CommentsResponse>(`/comments/${postSlug}`, {
      params: { page, limit, sort },
    });
    return data;
  },

  createComment: async (
    postSlug: string,
    content: string,
    parentId?: string
  ): Promise<Comment> => {
    const { data } = await api.post<Comment>("/comments", {
      postSlug,
      content,
      parentId,
    });
    return data;
  },

  updateComment: async (id: string, content: string): Promise<Comment> => {
    const { data } = await api.put<Comment>(`/comments/${id}`, { content });
    return data;
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  likeComment: async (id: string): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/comments/${id}/like`);
    return data;
  },

  dislikeComment: async (id: string): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/comments/${id}/dislike`);
    return data;
  },

  getReplies: async (id: string): Promise<Comment[]> => {
    const { data } = await api.get<Comment[]>(`/comments/${id}/replies`);
    return data;
  },
};
