import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/init-db
 * Database connectivity check (development only).
 * Schema is managed by Prisma — run `npx prisma db push` to sync tables.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    // Simple liveness check
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        message: 'Database connection successful.',
        note: 'Schema is managed by Prisma. Run `npx prisma db push` to sync schema changes.',
        models: ['User', 'Otp'],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connectivity check failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
}
