import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

export async function GET(request, { params }) {
  // TODO: Implement this route
  // Get the id from params and convert to a number
  const id = Number(params.id);

  // TODO: Query the database for a project with this id
  // Use prisma.project.findUnique({ where: { id } })

  // TODO: If project not found, return 404
  // TODO: If project found, return it as JSON
}
