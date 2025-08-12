import { getCategoryData } from '@/utils/fileUtils';
import { NextResponse } from 'next/server';

export async function GET() {
  const industries = getCategoryData('industries');
  const products = getCategoryData('products');
  
  return NextResponse.json({
    industries,
    products
  });
}
