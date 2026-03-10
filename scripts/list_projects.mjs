// ============================================
// UTILITY SCRIPT: List All Projects
// Purpose: Print all projects from database to console
// Run with: node scripts/list_projects.mjs
// ============================================

import 'dotenv/config';  // Load environment variables from .env file
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';  // PostgreSQL adapter
import { Pool } from 'pg';                      // Connection pool manager

// Setup database connection
// Pool manages connections to Neon database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);  // Adapter translates Prisma queries to PostgreSQL
const prisma = new PrismaClient({ adapter });  // Prisma client for database operations

(async function(){
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    console.log(JSON.stringify(projects, null, 2));
  } catch (e) {
    console.error('Error querying projects:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
