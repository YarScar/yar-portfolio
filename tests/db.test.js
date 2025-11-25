import { describe, it, expect } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
