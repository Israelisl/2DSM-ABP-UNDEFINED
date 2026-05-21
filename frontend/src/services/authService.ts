// frontend/src/services/authService.ts

const API_PREFIX = import.meta.env.VITE_API_URL ?? '';

export const authService = {
  async login(username: string, password: string): Promise<{ token: string }> {
    const response = await fetch(`${API_PREFIX}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }), // Envia login e senha conforme o RF09
    });

    if (!response.ok) {
      throw new Error('Usuário ou senha inválidos.');
    }

    return response.json(); // Retorna o objeto contendo o JWT enviado pelo backend
  }
};