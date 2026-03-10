// ============================================
// PRISMA CLIENT SETUP (Database Connection)
// Purpose: Create a single Prisma instance to talk to database
// ============================================

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';  // PostgreSQL adapter for Prisma
import { Pool } from 'pg';                      // PostgreSQL connection pool manager

// Create PostgreSQL connection pool
// Pool = manages multiple database connections efficiently
// Reads DATABASE_URL from environment variables (.env file)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Prisma adapter using the connection pool
// Adapter = translator between Prisma and PostgreSQL
const adapter = new PrismaPg(pool);

// Get global object (prevents multiple Prisma instances in development)
const globalForPrisma = globalThis;

// Create or reuse Prisma client
// In dev: reuse existing instance (prevents "too many connections" error)
// In prod: create new instance each time
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// Save Prisma instance globally in development
// Why? Hot reloading in dev would create new instances without this
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
