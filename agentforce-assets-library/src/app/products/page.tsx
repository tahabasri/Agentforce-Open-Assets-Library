'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import Section from '@/components/Section';
import { AppData } from '@/types';
import { getStaticData } from '@/utils/staticData';

import { useSelectedProduct } from '@/context/SelectedProductContext';
import { useSearch } from '@/context/SearchContext';

export default function Products() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { selectedProduct, setSelectedProduct } = useSelectedProduct();
  const { searchTerm } = useSearch();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getStaticData();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // No hash logic needed, context handles selection

  if (loading) {
    return (
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex justify-center items-center h-screen glass-intense text-white font-bold text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex justify-center items-center h-screen">
          <div className="glass text-white border border-white/20 p-4 rounded-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex justify-center items-center h-screen">
          <div className="glass text-white border border-white/20 p-4 rounded-xl">No data available</div>
        </div>
      </div>
    );
  }

  // Filtered products
  const filteredProducts = selectedProduct
    ? { [selectedProduct]: data.products[selectedProduct] }
    : data.products;

  // Asset type filter
  const assetTypes = ['Actions', 'Topics', 'Agents'];

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Hero Section */}
        <div className="glass-intense text-white py-12 border-b border-white/20">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-shimmer">Products</h1>
            <p className="text-xl md:text-2xl text-white/90">Explore product-specific assets for Einstein Agents</p>
          </div>
        </div>
        {/* Filter Section */}
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Product Filter */}
            <div>
              <div className="font-bold text-white mb-2">Products</div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(data.products)
                  .filter(product => searchTerm ? product.toLowerCase().includes(searchTerm.toLowerCase()) : true)
                  .map((product) => (
                    <button
                      key={product}
                      className={`glass-interactive glass px-4 py-2 rounded-lg font-medium text-white transition-all ${selectedProduct === product ? 'glass-intense' : ''}`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product}
                    </button>
                  ))}
              </div>
            </div>
            {/* Asset Type Filter */}
            <div>
              <div className="font-bold text-white mb-2">Asset Types</div>
              <div className="flex flex-wrap gap-2">
                {assetTypes.map((type) => (
                  <button
                    key={type}
                    className={`glass-interactive glass px-4 py-2 rounded-lg font-medium text-white transition-all ${selectedType === type ? 'glass-intense' : ''}`}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 max-w-6xl mx-auto w-full flex-1">
          {/* Products Sections */}
          {
            (() => {
              let hasAssets = false;
              Object.entries(filteredProducts).forEach(([, categoryData]) => {
                if (!categoryData) return;
                if (
                  ((!selectedType || selectedType === 'Actions') && categoryData.actions && Object.keys(categoryData.actions).length > 0) ||
                  ((!selectedType || selectedType === 'Topics') && categoryData.topics && Object.keys(categoryData.topics).length > 0) ||
                  ((!selectedType || selectedType === 'Agents') && categoryData.agents && Object.keys(categoryData.agents).length > 0)
                ) {
                  hasAssets = true;
                }
              });
              if (!hasAssets) {
                return (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Image src="/images/globe.svg" alt="No results" width={96} height={96} style={{marginBottom: '1.5rem', opacity: 0.8}} />
                    <h3 className="text-2xl font-bold text-white mb-2">No assets found</h3>
                    <p className="text-white/80 mb-4 text-center">Try changing your filters or check back later for new assets!</p>
                  </div>
                );
              }
              return Object.entries(filteredProducts).map(([product, categoryData]) => {
                if (!categoryData) return null;
                // Filter assets based on search term
                const filteredActions = Object.fromEntries(
                  Object.entries(categoryData.actions ?? {}).filter(([name, asset]) => 
                    searchTerm ? 
                      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (asset.description && typeof asset.description === 'string' && 
                       asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    : true
                  )
                );
                const filteredTopics = Object.fromEntries(
                  Object.entries(categoryData.topics ?? {}).filter(([name, asset]) => 
                    searchTerm ? 
                      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (asset.description && typeof asset.description === 'string' && 
                       asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    : true
                  )
                );
                const filteredAgents = Object.fromEntries(
                  Object.entries(categoryData.agents ?? {}).filter(([name, asset]) => 
                    searchTerm ? 
                      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (asset.description && typeof asset.description === 'string' && 
                       asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    : true
                  )
                );
                // Only render product if it has matching assets
                if (
                  ((!selectedType || selectedType === 'Actions') && Object.keys(filteredActions).length === 0) &&
                  ((!selectedType || selectedType === 'Topics') && Object.keys(filteredTopics).length === 0) &&
                  ((!selectedType || selectedType === 'Agents') && Object.keys(filteredAgents).length === 0)
                ) {
                  return null;
                }
                return (
                  <div key={`product-${product}`} className="mb-10 mt-8 glass p-6 rounded-xl shadow-lg glass-interactive">
                    <h2 id={product} className="text-2xl font-bold mb-6 text-white capitalize border-b-2 border-white/20 pb-2 animate-shimmer">{product}</h2>
                    {/* Actions Section */}
                    {(!selectedType || selectedType === 'Actions') && Object.keys(filteredActions).length > 0 && (
                      <Section 
                        title={`${product} Actions`} 
                        sortedBy="Most Popular" 
                        items={filteredActions}
                        defaultImage="/images/action-icon.svg"
                      />
                    )}
                    {/* Topics Section */}
                    {(!selectedType || selectedType === 'Topics') && Object.keys(filteredTopics).length > 0 && (
                      <Section 
                        title={`${product} Topics`} 
                        sortedBy="Most Popular" 
                        items={filteredTopics}
                        defaultImage="/images/topic-icon.svg"
                      />
                    )}
                    {/* Agents Section */}
                    {(!selectedType || selectedType === 'Agents') && Object.keys(filteredAgents).length > 0 && (
                      <Section 
                        title={`${product} Agents`} 
                        sortedBy="Most Popular" 
                        items={filteredAgents}
                        defaultImage="/images/agent-icon.svg"
                      />
                    )}
                  </div>
                );
              }).filter(Boolean);
            })()
          }
        </div>
        {/* Footer */}
        <div className="bg-blue-900 text-white py-8 mt-12 w-full">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p> a9 {new Date().getFullYear()} Agentforce Open Assets Library</p>
          </div>
        </div>
      </div>
    </div>
  );
}
