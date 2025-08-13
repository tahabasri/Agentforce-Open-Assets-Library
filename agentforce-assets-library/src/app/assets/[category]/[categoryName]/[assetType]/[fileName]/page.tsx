import React from 'react';
import { getStaticPaths } from '@/utils/staticData';
import AssetDetailsClient from './AssetDetailsClient';

// Generate static params for all possible routes
export async function generateStaticParams() {
  const paths = await getStaticPaths();
  return paths.map((path: { params: unknown }) => path.params as { category: string; categoryName: string; assetType: string; fileName: string });
}

export default function AssetDetails({ params }: { params: Promise<{ category: string; categoryName: string; assetType: string; fileName: string }> }) {
  return <AssetDetailsClient params={params} />;
}
