import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name || '') || '';
    const filename = `project-${timestamp}${extension}`;

    // In production (Vercel), use Blob storage for persistence
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      try {
        const blob = await put(`uploads/${filename}`, buffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: file.type || 'application/octet-stream',
        });
        return NextResponse.json({ message: 'File uploaded successfully', url: blob.url });
      } catch (err) {
        console.error('Vercel Blob upload error:', err);
        return NextResponse.json({ error: 'Upload failed (blob)' }, { status: 500 });
      }
    }

    // In local development, write to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);
    return NextResponse.json({ message: 'File uploaded successfully', url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}