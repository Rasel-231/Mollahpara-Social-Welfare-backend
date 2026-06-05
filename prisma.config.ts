import "dotenv/config";
import { defineConfig } from "@prisma/config";
import { config } from './src/config/index';

export default defineConfig({
  schema: "./prisma/schema.prisma",

  migrations: {
    path: "./prisma/migrations",
  },

  datasource: {
    url: config.databaseUrl
  },
});