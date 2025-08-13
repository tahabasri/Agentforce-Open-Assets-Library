"use client";

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import { AppData } from '@/types';
import { toSentenceCase } from '@/utils/stringUtils';

interface AssetDetailsParams {
  params: Promise<{
    category: string;
    categoryName: string;
    assetType: string;
    fileName: string;
  }>;
}

export default function AssetDetails({ params }: AssetDetailsParams) {
  // Use React.use(params) with type assertion for latest Next.js dynamic route param handling
  const { category, categoryName, assetType, fileName } = React.use(params) as {
    category: string;
    categoryName: string;
    assetType: string;
    fileName: string;
  };
  const [data, setData] = useState<AppData | null>(null);
  const [asset, setAsset] = useState<import('@/types').ActionFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      let found: import('@/types').ActionFile | null = null;
      const validTypes = ['actions', 'topics', 'agents'] as const;
      type AssetType = typeof validTypes[number];
      const possibleKeys = [fileName, fileName + '.json'];
      if (category === 'industries' && data.industries[categoryName]) {
        const group = data.industries[categoryName];
        if (validTypes.includes(assetType as AssetType)) {
          const assets = group[assetType as keyof typeof group] as Record<string, import('@/types').ActionFile>;
          if (assets) {
            for (const key of possibleKeys) {
              if (Object.prototype.hasOwnProperty.call(assets, key)) {
                found = assets[key];
                break;
              }
            }
          }
        }
      } else if (category === 'products' && data.products[categoryName]) {
        const group = data.products[categoryName];
        if (validTypes.includes(assetType as AssetType)) {
          const assets = group[assetType as keyof typeof group] as Record<string, import('@/types').ActionFile>;
          if (assets) {
            for (const key of possibleKeys) {
              if (Object.prototype.hasOwnProperty.call(assets, key)) {
                found = assets[key];
                break;
              }
            }
          }
        }
      }
      setAsset(found);
    }
  }, [data, category, categoryName, assetType, fileName]);

  if (loading) {
    return <div className="flex"><Navigation /><div className="flex-1 flex justify-center items-center h-screen glass-intense text-white font-bold text-lg">Loading...</div></div>;
  }
  if (error) {
    return <div className="flex"><Navigation /><div className="flex-1 flex justify-center items-center h-screen glass text-white border border-white/20 p-4 rounded-xl">Error: {error}</div></div>;
  }
  if (!asset) {
    return <div className="flex"><Navigation /><div className="flex-1 flex justify-center items-center h-screen glass text-white border border-white/20 p-4 rounded-xl">Asset not found</div></div>;
  }

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="glass-intense text-white py-12 border-b border-white/20">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg animate-shimmer">{toSentenceCase(fileName.replace(/_/g, ' '))}</h1>
            <p className="text-xl mb-8 text-white/90">Full asset details</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="glass p-8 rounded-xl shadow-lg glass-interactive border border-white/20">
            {typeof asset.imageSrc === 'string' && asset.imageSrc && (
              <div className="mb-6 flex justify-center">
                <Image src={asset.imageSrc} alt={fileName} width={96} height={96} className="object-contain animate-float" />
              </div>
            )}
            <h2 className="text-2xl font-bold text-white mb-2">{toSentenceCase(fileName.replace(/_/g, ' '))}</h2>
            <p className="text-white/90 mb-4 font-medium">{asset.description || 'No description available.'}</p>
            <div className="mb-4">
              <span className="font-semibold text-white">Source File:</span> <span className="text-white/80">{asset.sourceFile || 'Not specified'}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-white">Dependencies:</span> <span className="text-white/80">{asset.dependencies && asset.dependencies.length > 0 ? asset.dependencies.join(', ') : 'None'}</span>
            </div>
            {asset.tags && Array.isArray(asset.tags) && asset.tags.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold text-white">Tags:</span> <span className="text-white/80">{asset.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
