"use client";

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import { AppData } from '@/types';
import { toSentenceCase } from '@/utils/stringUtils';

interface AssetDetailsParams {
  params: {
    category: string;
    categoryName: string;
    assetType: string;
    fileName: string;
  };
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
    return <div className="flex"><Navigation /><div className="flex-1 flex justify-center items-center h-screen bg-white text-blue-800 font-bold text-lg">Loading...</div></div>;
  }
  if (error) {
    return <div className="flex"><Navigation /><div className="flex-1 flex justify-center items-center h-screen bg-red-50 text-red-700 border border-red-300 p-4 rounded-lg">Error: {error}</div></div>;
  }
  if (!asset) {
    return <div className="flex"><Navigation /><div className="flex-1 flex justify-center items-center h-screen bg-yellow-50 text-yellow-800 border border-yellow-300 p-4 rounded-lg">Asset not found</div></div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg">{toSentenceCase(fileName.replace(/_/g, ' '))}</h1>
            <p className="text-xl mb-8 text-blue-100">Full asset details</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow p-8 border border-blue-200">
            {typeof asset.imageSrc === 'string' && asset.imageSrc && (
              <div className="mb-6 flex justify-center">
                <Image src={asset.imageSrc} alt={fileName} width={96} height={96} className="object-contain" />
              </div>
            )}
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{toSentenceCase(fileName.replace(/_/g, ' '))}</h2>
            <p className="text-gray-900 mb-4 font-medium">{asset.description || 'No description available.'}</p>
            <div className="mb-4">
              <span className="font-semibold text-blue-900">Source File:</span> <span className="text-gray-800">{asset.sourceFile || 'Not specified'}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-blue-900">Dependencies:</span> <span className="text-gray-800">{asset.dependencies && asset.dependencies.length > 0 ? asset.dependencies.join(', ') : 'None'}</span>
            </div>
            {asset.tags && Array.isArray(asset.tags) && asset.tags.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold text-blue-900">Tags:</span> <span className="text-gray-800">{asset.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
