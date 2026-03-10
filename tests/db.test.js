// ============================================
// DATABASE TESTS
// Purpose: Test Prisma schema and database queries
// Run with: npm test
// ============================================

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";  // PostgreSQL adapter
import { Pool } from 'pg';                       // Connection pool manager

let prisma;

// Setup: Run before all tests
beforeAll(() => {
  // Create database connection for testing
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);  // Adapter translates Prisma queries to PostgreSQL
  prisma = new PrismaClient({ adapter });  // Prisma client for database operations
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
