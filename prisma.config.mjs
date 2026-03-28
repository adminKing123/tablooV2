import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 config file.
 * The CLI reads the database URL from here (not from schema.prisma).
 * Docs: https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
