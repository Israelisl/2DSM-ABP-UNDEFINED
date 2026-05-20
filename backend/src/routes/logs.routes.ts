import { Router } from "express";
import { createLog, listLogs } from "../controllers/logs.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.post("/", createLog);

router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  listLogs
);

export default router;