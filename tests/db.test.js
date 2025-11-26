import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma;

beforeAll(() => {
  const adapter = new PrismaPg({ 
    connectionString: process.env.DATABASE_URL 
  });
  prisma = new PrismaClient({ adapter });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Project model exists in schema", () => {
  it("should read from Project table", async () => {
    const projects = await prisma.project.findMany();
    expect(Array.isArray(projects)).toBe(true);
  });

  it("should have correct fields", async () => {
    const projects = await prisma.project.findMany();
    if (projects.length > 0) {
      const project = projects[0];
      expect(project).toHaveProperty("id");
      expect(project).toHaveProperty("title");
      expect(project).toHaveProperty("description");
      expect(project).toHaveProperty("createdAt");
    }
  });
});
