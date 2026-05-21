import {inquiryRepository, type InquiryCreateData, type InquiryStatus,} from "../repositories/inquiry.repository";

export const inquiryService = {
  // Camada de serviço para encapsular a lógica de negócios e impedir que
  // o controller acesse diretamente o repositório.
  async createInquiry(data: InquiryCreateData) {
    return inquiryRepository.createInquiry(data);
  },

  // Repassa a listagem para o repositorio, mantendo o controller sem SQL.
  async findAll() {
    return inquiryRepository.findAll();
  },

  // Centraliza a alteracao de status para preservar a separacao entre camadas.
  async updateStatus(id: number, status: InquiryStatus, answeredBy: string | null) {
    return inquiryRepository.updateStatus(id, status, answeredBy);
  },
};
