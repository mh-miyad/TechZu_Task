import type { AuthResponse } from "../types";
import api from "./axios";

export const authService = {
  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", {
      username,
      email,
      password,
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: data._id, username: data.username, email: data.email })
      );
    }
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: data._id, username: data.username, email: data.email })
      );
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
