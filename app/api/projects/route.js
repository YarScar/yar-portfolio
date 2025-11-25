import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

export async function GET() {
  // TODO: Implement this route
  // Should return all projects from the database as JSON
  // Use prisma.project.findMany() to query the database
}
