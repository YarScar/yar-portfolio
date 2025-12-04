import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ ok: true, count: projects.length, projects });
  } catch (err) {
    console.error('Dev projects route error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
