'use client';

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import { ActionFile } from '@/types';
import { toSentenceCase } from '@/utils/stringUtils';
import { getStaticData } from '@/utils/staticData';
import { downloadAssetFiles } from '@/utils/zipUtils';
import { generateDeployCommand } from '@/utils/commandUtils';
import CopyCommand from '@/components/CopyCommand';

import { GITHUB_PUBLIC_URL } from '@/constants/global';

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
  const [assetType, setAssetType] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAsset = async () => {
      const resolvedParams = await params;
      setFileName(resolvedParams.fileName);
      setAssetType(resolvedParams.assetType);
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
                  
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <div className="text-white/70 text-xs mb-3">
                      {asset.dependencies && asset.dependencies.length > 0 && (
                        <div className="mt-1">
                          <div className="font-semibold text-xs text-white/90 mt-1">Dependencies:</div>
                          {asset.dependencies.map((dep, index) => {
                            const url = `${GITHUB_PUBLIC_URL}${dep.replace(/^\/+/, '')}`;
                            const parts = dep.split('/').filter(Boolean);
                            const file = parts.pop();
                            const parent = parts.length > 0 ? parts[parts.length - 1] : '';
                            return (
                              <div key={index} className="flex items-start gap-1 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="break-all text-blue-300 underline hover:text-blue-400"
                                >
                                  {parent ? `${parent}/` : ''}{file}
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Download Button */}
                  <button 
                    onClick={async () => {
                      setDownloadError(null);
                      setDownloading(true);
                      try {
                        await downloadAssetFiles(asset, fileName);
                      } catch (error) {
                        console.error('Error downloading files:', error);
                        setDownloadError('Failed to download files. Please try again.');
                      } finally {
                        setDownloading(false);
                      }
                    }}
                    disabled={downloading}
                    className={`mt-4 px-4 py-2 ${downloading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} rounded-md text-white flex items-center gap-2 transition-colors`}
                  >
                    {downloading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Preparing Files...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Files
                      </>
                    )}
                  </button>
                  {downloadError && <p className="mt-2 text-red-500 text-sm">{downloadError}</p>}
                </div>
              </div>

              {/* Command Section */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <CopyCommand command={generateDeployCommand(asset, fileName, assetType)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
