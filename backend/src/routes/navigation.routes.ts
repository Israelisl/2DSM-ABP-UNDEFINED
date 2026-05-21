import { Router } from "express";
import {
  createNavigationNode,
  deleteNavigationNode,
  getChildren,
  getRootNavigation,
  listNavigationNodes,
  updateNavigationNode,
} from "../controllers/navigation.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/root", getRootNavigation);

router.get ("/:slug/children", getChildren);

router.get("/", authMiddleware, requireRole("ADMIN", "SECRETARIA"), listNavigationNodes);

router.post("/", authMiddleware, requireRole("ADMIN"), createNavigationNode);

router.put("/:id", authMiddleware, requireRole("ADMIN"), updateNavigationNode);

router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteNavigationNode);

export default router;
