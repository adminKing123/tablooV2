import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Prisma Client Singleton (Prisma 7 + @prisma/adapter-pg)
 *
 * Prisma 7 removed the Rust query engine. Database connectivity now goes
 * through a driver adapter. PrismaPg wraps the pg connection pool and is
 * passed directly into PrismaClient.
 *
 * The global singleton prevents Next.js hot-reloading from spawning a new
 * pool on every module reload, which would exhaust database connections.
 */

const globalForPrisma = globalThis;

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
