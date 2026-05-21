// frontend/src/hooks/useAuth.ts
import { useState } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(username, password);
      
      // Armazena o token JWT com segurança no localStorage do navegador (RNF08)
      localStorage.setItem('token', data.token);
      setToken(data.token);
      return true;
    } catch (err) {
      const errorInstance = err as Error;
      setError(errorInstance.message || 'Erro ao realizar login.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return { token, error, loading, login, logout, isAuthenticated: !!token };
}