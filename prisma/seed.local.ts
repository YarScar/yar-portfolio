import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const sampleProjects = [
    { title: "Portfolio Website", description: "A modern portfolio website built with Next.js and Prisma", image: "/portfolio-screenshot.png", url: "https://github.com/yourusername/portfolio" },
    { title: "E-commerce Platform", description: "Full-stack e-commerce solution with payment integration", image: "/ecommerce-screenshot.png", url: "https://github.com/yourusername/ecommerce" },
    { title: "Task Management App", description: "Collaborative task management application with real-time updates", image: "/taskmanager-screenshot.png", url: "https://github.com/yourusername/task-manager" }
  ];

  for (const project of sampleProjects) {
    const existingProject = await prisma.project.findFirst({ where: { title: project.title } });
    if (!existingProject) {
      await prisma.project.create({ data: project });
      console.log(`✅ Created project: ${project.title}`);
    } else {
      console.log(`⏭️ Project already exists: ${project.title}`);
    }
  }

  const projectCount = await prisma.project.count();
  console.log(`🎉 Database seeded successfully! Total projects: ${projectCount}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });