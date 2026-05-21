import { Router } from "express";
import { createInquiry, getInquiries, updateInquiryStatus } from "../controllers/inquiry.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// Lista todas as duvidas cadastradas. Como expõe dados dos solicitantes,
// fica restrita a usuarios autenticados da secretaria ou administradores.
router.get("/", authMiddleware, requireRole("ADMIN", "SECRETARIA"), getInquiries);

router.post("/", createInquiry);

// Atualiza apenas o status da duvida, mantendo essa acao separada da criacao.
// Tambem exige login para registrar quem marcou a duvida como respondida.
router.patch("/:id/status", authMiddleware, requireRole("ADMIN", "SECRETARIA"), updateInquiryStatus);

export default router;
