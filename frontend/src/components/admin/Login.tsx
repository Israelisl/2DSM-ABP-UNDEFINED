import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { AuthUser } from "../../services/authService";

type LoginProps = {
  onLoginSuccess: (user: AuthUser) => void;
};

export function Login({ onLoginSuccess }: LoginProps) {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const authenticatedUser = await login(email, password);

    if (authenticatedUser) {
      onLoginSuccess(authenticatedUser);
    }
  };

  return (
    <div className="sd-login-box">
      <h2>Area Administrativa</h2>
      <p>Acesso restrito para secretaria e administradores.</p>

      <form onSubmit={handleSubmit} className="sd-login-form">
        <div className="sd-input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="admin@fatec.sp.gov.br"
          />
        </div>

        <div className="sd-input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="Digite sua senha"
          />
        </div>

        {error && <div className="sd-auth-error">{error}</div>}

        <button type="submit" disabled={loading} className="sd-btn-primary">
          {loading ? "Autenticando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
