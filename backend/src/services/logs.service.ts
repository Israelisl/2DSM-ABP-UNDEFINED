import { logsRepository } from "../repositories/logs.repository";

export const logsService = {
    async createLog(data: {
        sessionId?: string;
        navigationFlow: unknown[];
        inquiryIds?: number[];
        flag?: "ATENDEU" | "NAO_ATENDEU";
        feedbackComment?: string | null;
    }) {
        return logsRepository.create(data);
    },
    async listLogs() {
        return logsRepository.findAll();
    }
};
