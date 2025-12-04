import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  try {
    console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
    const projects = await prisma.project.findMany();
    console.log('Projects count:', projects.length);
    console.log(JSON.stringify(projects, null, 2));
  } catch (err) {
    console.error('Prisma error:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();