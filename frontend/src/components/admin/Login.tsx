// frontend/src/components/admin/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      onLoginSuccess(); // Dispara a ação após o login bem-sucedido
    }
  };

  return (
    <div className="sd-login-box">
      <h2>Área Administrativa</h2>
      <p>Acesso restrito para Secretária e Administradores</p>

      <form onSubmit={handleSubmit} className="sd-login-form">
        <div className="sd-input-group">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Digite seu usuário ou e-mail"
          />
        </div>

        <div className="sd-input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite sua senha"
          />
        </div>

        {error && <div className="sd-auth-error">{error}</div>}

        <button type="submit" disabled={loading} className="sd-btn-primary">
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}