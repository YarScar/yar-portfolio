import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
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
