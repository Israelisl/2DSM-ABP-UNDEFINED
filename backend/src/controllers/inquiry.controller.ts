import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { inquiryService } from "../services/inquiry.service";
import type { InquiryStatus } from "../repositories/inquiry.repository";

// Validação simples de email para evitar entradas claramente inválidas.
function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function getInquiries(_req: Request, res: Response) {
  try {
    // Busca a lista completa para a tela administrativa acompanhar as duvidas.
    const inquiries = await inquiryService.findAll();
    res.json(inquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar as duvidas." });
  }
}

export async function updateInquiryStatus(req: AuthenticatedRequest, res: Response) {
  // O id vem pela URL e precisa ser um numero inteiro valido.
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Id da duvida invalido." });
    return;
  }

  if (status !== "ABERTA" && status !== "RESPONDIDA") {
    res.status(400).json({ message: "Status invalido. Use ABERTA ou RESPONDIDA." });
    return;
  }

  try {
    // Quando a duvida e marcada como respondida, é guardado qual usuario fez isso.
    // Se voltar para aberta, o responsavel e removido para refletir o novo estado.
    const answeredBy = status === "RESPONDIDA" ? req.user?.id ?? null : null;
    const inquiry = await inquiryService.updateStatus(id, status as InquiryStatus, answeredBy);

    if (!inquiry) {
      res.status(404).json({ message: "Duvida nao encontrada." });
      return;
    }

    res.json(inquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar o status da duvida." });
  }
}

export async function createInquiry(req: Request, res: Response) {
  // Recebe os dados do formulário enviados pelo frontend.
  const { requester_name, requester_email, question } = req.body;

  // Valida campos obrigatórios.
  if (!requester_name || !requester_email || !question) {
    res.status(400).json({ message: "Nome, email e pergunta são obrigatórios." });
    return;
  }

  // Valida tipos de dados para evitar valores inesperados.
  if (typeof requester_name !== "string" || typeof requester_email !== "string" || typeof question !== "string") {
    res.status(400).json({ message: "Nome, email e pergunta devem ser texto." });
    return;
  }

  if (!isValidEmail(requester_email)) {
    res.status(400).json({ message: "Email inválido." });
    return;
  }

  // Evita strings apenas com espaços.
  if (requester_name.trim().length === 0 || question.trim().length === 0) {
    res.status(400).json({ message: "Nome e pergunta não podem ficar em branco." });
    return;
  }

  // Limites de tamanho compatíveis com a coluna do banco.
  if (requester_name.length > 160) {
    res.status(400).json({ message: "O nome pode ter no máximo 160 caracteres." });
    return;
  }

  if (requester_email.length > 160) {
    res.status(400).json({ message: "O email pode ter no máximo 160 caracteres." });
    return;
  }

  try {
    // Cria a dúvida usando a camada de serviço.
    const inquiry = await inquiryService.createInquiry({ requester_name, requester_email, question });
    res.status(201).json(inquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao salvar a dúvida." });
  }
}
