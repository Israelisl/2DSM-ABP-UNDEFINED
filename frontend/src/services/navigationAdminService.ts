import { apiRequest } from "./apiClient";

export type AdminNavigationNode = {
  id: number;
  parent_id: number | null;
  parent_title?: string | null;
  title: string;
  slug: string;
  prompt: string | null;
  answer_summary: string | null;
  evidence_excerpt: string | null;
  evidence_source: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type NavigationNodePayload = {
  parent_id: number | null;
  title: string;
  slug: string;
  prompt: string | null;
  answer_summary: string | null;
  evidence_excerpt: string | null;
  evidence_source: string | null;
  display_order: number;
  is_active: boolean;
};

export const navigationAdminService = {
  list() {
    return apiRequest<AdminNavigationNode[]>("/navigation", { auth: true });
  },

  create(payload: NavigationNodePayload) {
    return apiRequest<AdminNavigationNode>("/navigation", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  update(id: number, payload: NavigationNodePayload) {
    return apiRequest<AdminNavigationNode>(`/navigation/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  deactivate(id: number) {
    return apiRequest<void>(`/navigation/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
