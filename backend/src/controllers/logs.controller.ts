import { Request, Response } from "express";
import { logsService } from "../services/logs.service";

export async function createLog(req: Request, res: Response) {
  const { sessionId, navigationFlow, inquiryIds, flag, feedbackComment } = req.body;

  if (!Array.isArray(navigationFlow)) {
    res.status(400).json({ error: "Fluxo de navegacao invalido." });
    return;
  }

  if (inquiryIds !== undefined && !Array.isArray(inquiryIds)) {
    res.status(400).json({ error: "Lista de duvidas invalida." });
    return;
  }

  if (flag !== undefined && flag !== "ATENDEU" && flag !== "NAO_ATENDEU") {
    res.status(400).json({ error: "Feedback invalido." });
    return;
  }

    try {
        const log = await logsService.createLog({
          sessionId,
          navigationFlow,
          inquiryIds,
          flag,
          feedbackComment: typeof feedbackComment === "string" && feedbackComment.trim()
            ? feedbackComment.trim()
            : null,
        });
        return res.status(201).json(log);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error:"Erro ao criar log"})
    }
}

export async function listLogs(req: Request, res: Response) {
  try {
    const logs = await logsService.listLogs();
    return res.json(logs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar logs" });
  }
}
