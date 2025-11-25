import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

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
