import { Request, Response } from "express";
import { logsService } from "../services/logs.service";

export async function createLog(req: Request, res: Response) {
    try {
        const log = await logsService.createLog(req.body);
        return res.status(201).json(log);
    }
    catch {
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