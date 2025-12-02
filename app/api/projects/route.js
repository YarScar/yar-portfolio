import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    return new Response(JSON.stringify(projects), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/projects error', err);
    return new Response(JSON.stringify({ message: 'Failed to fetch projects' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, technologies, url, image } = body;
    
    if (!title || !description) {
      return new Response(
        JSON.stringify({ message: 'Title and description are required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        url: url || null,
        image: image || null
      }
    });

    return new Response(JSON.stringify(project), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('POST /api/projects error', err);
    return new Response(JSON.stringify({ message: 'Failed to create project' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
