import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config();

const env = process.env as Record<string, string | undefined>;

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: env.DATABASE_URL,
    shadowDatabaseUrl: env.DIRECT_URL,
  },
});

