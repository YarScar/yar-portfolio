// ============================================
// API ROUTE: /api/projects/[id]
// Purpose: Handle GET (fetch one), PUT (update), DELETE for single project
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

// ============================================
// GET /api/projects/[id]
// Fetch a single project by ID
// ============================================
export async function GET(request, { params }) {
  // IMPORTANT: In Next.js 15+, params is a Promise and must be awaited
  // Old way (Next.js 14): const id = Number(params.id)
  // New way (Next.js 15+): await params first, then access properties
  const { id: paramId } = await params;
  const id = Number(paramId);
  
  // Validate that id is a valid number
  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ message: 'Invalid id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify(project), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/projects/[id] error', err);
    return new Response(JSON.stringify({ message: 'Failed to fetch project' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// ============================================
// DELETE /api/projects/[id]
// Delete a project by ID
// ============================================
export async function DELETE(request, { params }) {
  // Await params (required in Next.js 15+)
  const { id: paramId } = await params;
  const id = Number(paramId);
  
  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ message: 'Invalid id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return new Response(JSON.stringify({ message: 'Project not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    await prisma.project.delete({ where: { id } });
    
    return new Response(JSON.stringify({ message: 'Project deleted successfully' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('DELETE /api/projects/[id] error', err);
    return new Response(JSON.stringify({ message: 'Failed to delete project' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// ============================================
// PUT /api/projects/[id]
// Update a project by ID
// ============================================
export async function PUT(request, { params }) {
  // Await params (required in Next.js 15+)
  const { id: paramId } = await params;
  const id = Number(paramId);
  
  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ message: 'Invalid id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const { title, description, url, image, tags, long } = body;
    
    if (!title || !description) {
      return new Response(
        JSON.stringify({ message: 'Title and description are required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return new Response(JSON.stringify({ message: 'Project not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        url: url || null,
        image: image || null,
        tags: Array.isArray(tags) ? tags : [],
        long: long || null
      }
    });

    return new Response(JSON.stringify(updatedProject), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('PUT /api/projects/[id] error', err);
    return new Response(JSON.stringify({ message: 'Failed to update project' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
