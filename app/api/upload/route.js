import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

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
    const extension = path.extname(file.name);
    const filename = `project-${timestamp}${extension}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(path.join(uploadsDir, '.gitkeep'), '');
    } catch (error) {
      // Directory might already exist, that's okay
    }

    await writeFile(filepath, buffer);
    
    // Return the public URL
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}