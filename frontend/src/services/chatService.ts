// frontend/src/services/chatService.ts

export type NavigationNode = {
  id: number;
  title: string;
  slug: string;
  answer_summary?: string | null;
  evidence_excerpt?: string | null;
  evidence_source?: string | null;
};

const API_PREFIX = import.meta.env.VITE_API_URL ?? '';

function getApiUrl(path: string) {
  return `${API_PREFIX}${path}`;
}

export const chatService = {
  async fetchRoot(): Promise<NavigationNode[]> {
    const response = await fetch(getApiUrl('/navigation/root'));
    if (!response.ok) throw new Error('Falha ao carregar o menu inicial.');
    return response.json();
  },

  async fetchChildren(slug: string): Promise<{ parent: NavigationNode; children: NavigationNode[] }> {
    const response = await fetch(getApiUrl(`/navigation/${slug}/children`));
    if (!response.ok) throw new Error('Nó não encontrado');
    return response.json();
  }
};