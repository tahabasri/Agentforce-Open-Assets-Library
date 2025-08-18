import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'No file path provided' }, { status: 400 });
  }

  // Ensure the path is within the repo
  const baseDir = process.cwd();
  const fullPath = path.join(baseDir, '..', filePath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Detect file type to set appropriate content-type
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Return the file content directly, not as JSON
    return new NextResponse(content, { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return NextResponse.json({ error: 'Error reading file' }, { status: 500 });
  }
}
