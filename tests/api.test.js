import { describe, it, expect } from "vitest";

describe("GET /api/projects returns list", () => {
  it("should return an array of projects", async () => {
    const res = await fetch("http://localhost:3000/api/projects");
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});

describe("GET /api/projects/:id returns project", () => {
  it("should return one project", async () => {
    const res = await fetch("http://localhost:3000/api/projects/1");
    const data = await res.json();

    expect(data).toHaveProperty("id");
    expect(data.id).toBe(1);
  });

  it("should return 404 for non-existent project", async () => {
    const res = await fetch("http://localhost:3000/api/projects/99999");
    expect(res.status).toBe(404);
  });
});
