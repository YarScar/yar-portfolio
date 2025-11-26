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
