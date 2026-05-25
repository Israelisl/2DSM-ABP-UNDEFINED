import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

const validRoles = ["ADMIN", "SECRETARIA"] as const;
type UserRole = (typeof validRoles)[number];

function isValidRole(role: string): role is UserRole {
  return validRoles.includes(role as UserRole);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    res.status(400).json({ message: "Email e senha são obrigatórios." });
    return;
  }

  const result = await authService.login(email, password);

  if (!result) {
    res.status(401).json({ message: "Email ou senha inválidos." });
    return;
  }

  res.json(result);
}

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof role !== "string" ||
    !name ||
    !email ||
    !password ||
    !role
  ) {
    res.status(400).json({ message: "Nome, email, senha e role são obrigatórios." });
    return;
  }

  if (!isValidRole(role)) {
    res.status(400).json({ message: "Role inválida. Use ADMIN ou SECRETARIA." });
    return;
  }

  const user = await authService.register(name, email, password, role);

  if (!user) {
    res.status(409).json({ message: "Email já cadastrado." });
    return;
  }

  res.status(201).json(user);
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  res.json({ user: req.user });
}
