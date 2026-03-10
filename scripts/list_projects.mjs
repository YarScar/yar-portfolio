import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
