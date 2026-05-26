import { useState } from "react";
import { authService, type AuthUser } from "../services/authService";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => authService.getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await authService.login(email, password);
      authService.storeSession(data);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const errorInstance = err as Error;
      setError(errorInstance.message || "Erro ao realizar login.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return { token, user, error, loading, login, logout, isAuthenticated: !!token };
}
