// ============================================
// DATABASE SEED SCRIPT
// Purpose: Fill database with sample/test data
// Run with: npm run seed or node prisma/seed.js
// ============================================

import 'dotenv/config';  // Load environment variables from .env file
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";  // PostgreSQL adapter
import { Pool } from 'pg';                       // Connection pool manager

// Setup database connection
// Pool manages connections to Neon database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);  // Adapter translates Prisma queries to PostgreSQL
const prisma = new PrismaClient({ adapter });  // Prisma client for database operations

async function main() {
  // Example seed data using ES8+ features
  const sampleProjects = [
    {
      title: "Portfolio Website",
      description: "A modern portfolio website built with Next.js and Prisma",
      image: "/portfolio-screenshot.png",
      url: "https://github.com/yourusername/portfolio"
    },
    {
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      image: "/ecommerce-screenshot.png",
      url: "https://github.com/yourusername/ecommerce"
    },
    {
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates",
      image: "/taskmanager-screenshot.png",
      url: "https://github.com/yourusername/task-manager"
    }
  ];

  // Use modern array methods and destructuring
  for (const project of sampleProjects) {
    const existingProject = await prisma.project.findFirst({
      where: { title: project.title }
    });

    if (!existingProject) {
      await prisma.project.create({ data: project });
      console.log(`✅ Created project: ${project.title}`);
    } else {
      console.log(`⏭️  Project already exists: ${project.title}`);
    }
  }

  const projectCount = await prisma.project.count();
  console.log(`🎉 Database seeded successfully! Total projects: ${projectCount}`);
}

try {
  await main();
  await prisma.$disconnect();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
