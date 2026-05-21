const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function getApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type") && requestOptions.body) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getStoredToken();
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(path), {
    ...requestOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    throw new Error(payload?.message ?? payload?.error ?? "Erro ao comunicar com a API.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
