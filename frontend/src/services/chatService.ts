import { apiRequest } from "./apiClient";

export type NavigationNode = {
  id: number;
  title: string;
  slug: string;
  prompt?: string | null;
  answer_summary?: string | null;
  evidence_excerpt?: string | null;
  evidence_source?: string | null;
};

export type NavigationChildrenResponse = {
  parent: NavigationNode;
  children: NavigationNode[];
};

export const chatService = {
  fetchRoot() {
    return apiRequest<NavigationNode[]>("/navigation/root");
  },

  fetchChildren(slug: string) {
    return apiRequest<NavigationChildrenResponse>(`/navigation/${slug}/children`);
  },
};
