import { defineConfig } from "@prisma/config";

const env = (globalThis as any).process?.env ?? {};

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: env.DATABASE_URL || "postgresql://postgres.gdodmgbypvrhuggycqnn:Rasel150231@@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    shadowDatabaseUrl:
      env.DIRECT_URL ||
      "postgresql://postgres.gdodmgbypvrhuggycqnn:Rasel150231@@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  },
});

