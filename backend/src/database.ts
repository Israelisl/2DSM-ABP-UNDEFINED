import { Pool } from "pg";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL não configurada. Defina a conexão PostgreSQL no arquivo backend/.env.",
  );
}

export const pool = new Pool({
  connectionString: databaseUrl,
});
