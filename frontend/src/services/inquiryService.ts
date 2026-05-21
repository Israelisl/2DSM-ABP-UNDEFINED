import { apiRequest } from "./apiClient";

export type InquiryStatus = "ABERTA" | "RESPONDIDA";

export type Inquiry = {
  id: number;
  requester_name: string;
  requester_email: string;
  question: string;
  status: InquiryStatus;
  answered_by: string | null;
  answered_by_name?: string | null;
  created_at: string;
  updated_at?: string;
};

export type CreateInquiryPayload = {
  requester_name: string;
  requester_email: string;
  question: string;
};

export const inquiryService = {
  create(payload: CreateInquiryPayload) {
    return apiRequest<Inquiry>("/inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  list() {
    return apiRequest<Inquiry[]>("/inquiries", { auth: true });
  },

  updateStatus(id: number, status: InquiryStatus) {
    return apiRequest<Inquiry>(`/inquiries/${id}/status`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify({ status }),
    });
  },
};
