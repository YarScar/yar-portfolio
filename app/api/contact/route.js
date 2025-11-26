import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let payload = null;
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      payload = Object.fromEntries(new URLSearchParams(text));
    } else {
      try { payload = await request.json(); } catch (e) { payload = null; }
    }

    if (!payload || !payload.message) {
      return new Response(JSON.stringify({ message: 'Missing form fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Persist to the database (puts it in database YIPPIEEE)
    const created = await prisma.message.create({
      data: {
        name: payload.name || null,
        email: payload.email || null,
        message: payload.message,
      }
    });

    return new Response(JSON.stringify({ message: 'Message received', id: created.id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('POST /api/contact error', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: 'Contact endpoint available' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
