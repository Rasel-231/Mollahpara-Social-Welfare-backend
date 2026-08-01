import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres.gdodmgbypvrhuggycqnn:Rasel150231@@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    // 'directUrl' is not a known property on the datasource config type here;
    // use 'shadowDatabaseUrl' if you need a separate direct/shadow connection string.
    shadowDatabaseUrl:
      process.env.DIRECT_URL ||
      "postgresql://postgres.gdodmgbypvrhuggycqnn:Rasel150231@@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  },
});

