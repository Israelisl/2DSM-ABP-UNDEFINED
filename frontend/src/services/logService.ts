import { apiRequest } from "./apiClient";

export type FeedbackFlag = "ATENDEU" | "NAO_ATENDEU";

export type NavigationFlowEntry = {
  slug: string;
  title: string;
  selectedAt: string;
};

export type InteractionLog = {
  id: number;
  session_id: string;
  navigation_flow: NavigationFlowEntry[];
  inquiry_ids: number[];
  flag: FeedbackFlag | null;
  feedback_comment: string | null;
  created_at: string;
};

export type CreateLogPayload = {
  sessionId?: string;
  navigationFlow: NavigationFlowEntry[];
  inquiryIds?: number[];
  flag?: FeedbackFlag;
  feedbackComment?: string | null;
};

export const logService = {
  create(payload: CreateLogPayload) {
    return apiRequest<InteractionLog>("/logs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  list() {
    return apiRequest<InteractionLog[]>("/logs", { auth: true });
  },
};
