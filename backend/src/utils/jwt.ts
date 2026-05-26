import * as jwt from "jsonwebtoken";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

type TokenPayload = {
  id: string;
  email: string;
  role: string;
};

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

const unsafeJwtSecrets = new Set([
  "jwt-dev-secret",
  "change-me-in-production",
]);

function getJwtSecret(): Secret {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret || unsafeJwtSecrets.has(secret)) {
    throw new Error("JWT_SECRET deve ser configurado com um valor seguro.");
  }

  return secret;
}

function createToken(payload: TokenPayload): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "8h") as JwtExpiresIn;

  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

function verifyToken(token: string): TokenPayload | null {
  const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

  if (
    typeof decoded.id !== "string" ||
    typeof decoded.email !== "string" ||
    typeof decoded.role !== "string"
  ) {
    return null;
  }

  return { id: decoded.id, email: decoded.email, role: decoded.role };
}

export { createToken, type TokenPayload, verifyToken };