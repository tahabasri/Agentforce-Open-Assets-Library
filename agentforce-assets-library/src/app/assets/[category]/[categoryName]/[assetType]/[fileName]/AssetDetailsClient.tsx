'use client';

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import { ActionFile } from '@/types';
import { toSentenceCase } from '@/utils/stringUtils';
import { getStaticData } from '@/utils/staticData';

// Get asset data function
async function getAssetData(params: {
  category: string;
  categoryName: string;
  assetType: string;
  fileName: string;
}) {
  const { category, categoryName, assetType, fileName } = params;
  const data = await getStaticData();
  

  // Find the asset
  let asset: ActionFile | null = null;
  const validTypes = ['actions', 'topics', 'agents'] as const;
  type AssetType = typeof validTypes[number];
  const safeFileName = typeof fileName === 'string' ? fileName : '';
  const possibleKeys = [
    safeFileName,
    safeFileName + '.json',
    safeFileName.toLowerCase(),
    safeFileName.toLowerCase() + '.json',
    safeFileName.trim(),
    safeFileName.trim() + '.json',
    safeFileName.trim().toLowerCase(),
    safeFileName.trim().toLowerCase() + '.json'
  ];
  
  if (category === 'industries' && data.industries[categoryName]) {
    const group = data.industries[categoryName];
    if (validTypes.includes(assetType as AssetType)) {
      const assets = group[assetType as keyof typeof group] as Record<string, ActionFile>;
      if (assets) {
        for (const key of possibleKeys) {
          if (Object.prototype.hasOwnProperty.call(assets, key)) {
            asset = assets[key];
            break;
          }
        }
      }
    }
  } else if (category === 'products' && data.products[categoryName]) {
    const group = data.products[categoryName];
    if (validTypes.includes(assetType as AssetType)) {
      const assets = group[assetType as keyof typeof group] as Record<string, ActionFile>;
      if (assets) {
        for (const key of possibleKeys) {
          if (Object.prototype.hasOwnProperty.call(assets, key)) {
            asset = assets[key];
            break;
          }
        }
      }
    }
  }

  return { asset };
}


export default function AssetDetailsClient({ params }: { params: Promise<{ category: string; categoryName: string; assetType: string; fileName: string }> }) {
  const [asset, setAsset] = useState<ActionFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState('');
  
  useEffect(() => {
    const loadAsset = async () => {
      const resolvedParams = await params;
      setFileName(resolvedParams.fileName);
      const { asset } = await getAssetData(resolvedParams);
      setAsset(asset);
      setLoading(false);
    };
    
    loadAsset();
  }, [params]);
  
  if (loading) {
    return (
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex justify-center items-center h-screen glass-intense text-white font-bold text-lg">
          Loading...
        </div>
      </div>
    );
  }
  
  if (!asset) {
    return (
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex justify-center items-center h-screen glass text-white border border-white/20 p-4 rounded-xl">
          Asset not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="glass-intense text-white py-12 border-b border-white/20">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg animate-shimmer">{toSentenceCase(fileName.replace(/_/g, ' '))}</h1>
          </div>
        </div>
        {/* Asset Content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="glass p-6 rounded-xl shadow-lg mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Image 
                  src={typeof asset.imageSrc === 'string' ? asset.imageSrc : '/images/action-icon.svg'} 
                  alt={fileName} 
                  width={96} 
                  height={96} 
                  className="object-contain animate-float" 
                />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{toSentenceCase(fileName.replace(/_/g, ' '))}</h2>
                  <p className="text-white/90 mb-4">{asset.description || 'No description available.'}</p>
                  {asset.author && <p className="text-white/70 text-sm">Author: {asset.author}</p>}
                  {asset.company && <p className="text-white/70 text-sm">Company: {asset.company}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
