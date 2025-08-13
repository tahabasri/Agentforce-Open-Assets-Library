export const dynamic = "force-static";

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Read static data from the generated JSON file
  const dataPath = path.join(process.cwd(), 'public', 'generated', 'data.json');
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(jsonData);
  return NextResponse.json(data);
}
