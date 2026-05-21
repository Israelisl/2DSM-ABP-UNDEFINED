import { apiRequest, getStoredToken } from "./apiClient";

export type UserRole = "ADMIN" | "SECRETARIA";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

const USER_STORAGE_KEY = "user";

export const authService = {
  login(email: string, password: string) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getStoredToken,

  getStoredUser() {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  },

  storeSession(data: AuthResponse) {
    localStorage.setItem("token", data.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};
