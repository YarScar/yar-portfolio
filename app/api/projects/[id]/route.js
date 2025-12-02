import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

export async function GET(request, { params }) {
  const id = Number(params.id);
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

export async function DELETE(request, { params }) {
  const id = Number(params.id);
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

export async function PUT(request, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ message: 'Invalid id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const { title, description, url, image, tags } = body;
    
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
        tags: Array.isArray(tags) ? tags : []
      }
    });

    return new Response(JSON.stringify(updatedProject), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('PUT /api/projects/[id] error', err);
    return new Response(JSON.stringify({ message: 'Failed to update project' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
