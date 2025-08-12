'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import Section from '@/components/Section';
import { AppData } from '@/types';
import { useSearch } from '@/context/SearchContext';

export default function Products() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { searchTerm } = useSearch();

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
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pre-select product from hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && (!selectedProduct || selectedProduct !== hash)) {
        setSelectedProduct(hash);
      }
    }
  }, [selectedProduct]);

  if (loading) {
    return (
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex justify-center items-center h-screen bg-white text-blue-800 font-bold text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex justify-center items-center h-screen">
          <div className="bg-red-50 text-red-700 border border-red-300 p-4 rounded-lg">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex justify-center items-center h-screen">
          <div className="bg-yellow-50 text-yellow-800 border border-yellow-300 p-4 rounded-lg">No data available</div>
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
    <div className="flex min-h-screen bg-white">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Products</h1>
            <p className="text-xl md:text-2xl">Explore product-specific assets for Einstein Agents</p>
          </div>
        </div>
        {/* Filter Section */}
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Product Filter */}
            <div>
              <div className="font-bold text-blue-800 mb-2">Products</div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(data.products)
                  .filter(product => searchTerm ? product.toLowerCase().includes(searchTerm.toLowerCase()) : true)
                  .map((product) => (
                    <button
                      key={product}
                      className={`px-4 py-2 rounded border font-medium capitalize ${selectedProduct === product ? 'bg-blue-700 text-white border-blue-700' : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'}`}
                      onClick={() => {
                        setSelectedProduct(selectedProduct === product ? null : product);
                        if (typeof window !== 'undefined') {
                          window.history.replaceState(null, '', window.location.pathname);
                        }
                      }}
                    >
                      {product}
                    </button>
                  ))}
              </div>
            </div>
            {/* Asset Type Filter */}
            <div>
              <div className="font-bold text-blue-800 mb-2">Asset Types</div>
              <div className="flex flex-wrap gap-2">
                {assetTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded border font-medium capitalize ${selectedType === type ? 'bg-blue-700 text-white border-blue-700' : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'}`}
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
                if (
                  ((!selectedType || selectedType === 'Actions') && Object.keys(categoryData.actions).length > 0) ||
                  ((!selectedType || selectedType === 'Topics') && Object.keys(categoryData.topics).length > 0) ||
                  ((!selectedType || selectedType === 'Agents') && Object.keys(categoryData.agents).length > 0)
                ) {
                  hasAssets = true;
                }
              });
              if (!hasAssets) {
                return (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Image src="/images/globe.svg" alt="No results" width={96} height={96} style={{marginBottom: '1.5rem', opacity: 0.8}} />
                    <h3 className="text-2xl font-bold text-blue-700 mb-2">No assets found</h3>
                    <p className="text-gray-600 mb-4 text-center">Try changing your filters or check back later for new assets!</p>
                  </div>
                );
              }
              return Object.entries(filteredProducts).map(([product, categoryData]) => {
                // Filter assets based on search term
                const filteredActions = Object.fromEntries(
                  Object.entries(categoryData.actions).filter(([name, asset]) => 
                    searchTerm ? 
                      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (asset.description && typeof asset.description === 'string' && 
                       asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    : true
                  )
                );
                
                const filteredTopics = Object.fromEntries(
                  Object.entries(categoryData.topics).filter(([name, asset]) => 
                    searchTerm ? 
                      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (asset.description && typeof asset.description === 'string' && 
                       asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    : true
                  )
                );
                
                const filteredAgents = Object.fromEntries(
                  Object.entries(categoryData.agents).filter(([name, asset]) => 
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
                  <div key={`product-${product}`} className="mb-10 mt-8 bg-white p-6 rounded-lg shadow">
                    <h2 id={product} className="text-2xl font-bold mb-6 text-blue-800 capitalize border-b-2 border-blue-300 pb-2">{product}</h2>
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
