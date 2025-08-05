import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be configured");
}

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schema: "src/db/schema/*", // definicoes de tabelas do BD
  out: "src/db/migrations", // saida dos arquivos de migracao
  casing: "snake_case",
});
