"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import { AppData } from '@/types';

export default function AssetDetails({ params }: { params: { assetId: string } }) {
  const { assetId } = params;
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
      for (const industry of Object.values(data.industries)) {
        for (const type of ['actions', 'topics', 'agents'] as const) {
          const group = industry[type];
          if (group && Object.prototype.hasOwnProperty.call(group, assetId)) {
            found = group[assetId];
            break;
          }
        }
        if (found) break;
      }
      if (!found) {
        for (const product of Object.values(data.products)) {
          for (const type of ['actions', 'topics', 'agents'] as const) {
            const group = product[type];
            if (group && Object.prototype.hasOwnProperty.call(group, assetId)) {
              found = group[assetId];
              break;
            }
          }
          if (found) break;
        }
      }
      setAsset(found);
    }
  }, [data, assetId]);

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
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-4">{assetId.replace(/_/g, ' ')}</h1>
            <p className="text-xl mb-8">Full asset details</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow p-8 border border-blue-100">
            {typeof asset.imageSrc === 'string' && asset.imageSrc && (
              <div className="mb-6 flex justify-center">
                <Image src={asset.imageSrc} alt={assetId} width={96} height={96} className="object-contain" />
              </div>
            )}
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{assetId.replace(/_/g, ' ')}</h2>
            <p className="text-gray-700 mb-4">{asset.description || 'No description available.'}</p>
            <div className="mb-4">
              <span className="font-semibold text-blue-700">Source File:</span> {asset.sourceFile || 'Not specified'}
            </div>
            <div className="mb-4">
              <span className="font-semibold text-blue-700">Dependencies:</span> {asset.dependencies && asset.dependencies.length > 0 ? asset.dependencies.join(', ') : 'None'}
            </div>
            {asset.tags && Array.isArray(asset.tags) && asset.tags.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold text-blue-700">Tags:</span> {asset.tags.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
