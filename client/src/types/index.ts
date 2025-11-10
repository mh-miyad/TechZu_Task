export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export interface Comment {
  _id: string;
  postSlug: string;
  content: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  parentId: string | null;
  likes: string[];
  dislikes: string[];
  likeCount: number;
  dislikeCount: number;
  sentimentScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  page: number;
  pages: number;
  total: number;
}

export type SortOption = 'newest' | 'mostLiked' | 'mostDisliked';
