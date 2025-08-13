'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
// ...existing code...

interface SearchResult {
  title: string;
  category: string;
  categoryName: string;
  assetType: string;
  fileName: string;
  description?: string;
  url: string;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearchActive: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Search is active if there's a search term and we have results
  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <SearchContext.Provider 
      value={{ 
        searchTerm, 
        setSearchTerm, 
        searchResults, 
        setSearchResults,
        isSearchActive
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

// Helper function to search assets
export function searchAssets(
  data: Record<string, unknown>,
  searchTerm: string
): SearchResult[] {
  if (!data || !searchTerm || searchTerm.trim() === '') return [];
  
  const term = searchTerm.toLowerCase();
  const results: SearchResult[] = [];

  // Search industries
  if (data.industries) {
  Object.entries(data.industries as Record<string, Record<string, unknown>>).forEach(([categoryName, industry]) => {
      // Search actions, topics, and agents
      ['actions', 'topics', 'agents'].forEach(assetType => {
        const assets = (industry as Record<string, Record<string, unknown>>)[assetType] as Record<string, Record<string, unknown>> | undefined;
        if (assets) {
          Object.entries(assets).forEach(([fileName, item]) => {
            const title = fileName.replace('.json', '').replace(/_/g, ' ');
            const description = typeof (item as any).description === 'string' ? (item as any).description : '';
            const sourceFile = typeof (item as any).sourceFile === 'string' ? (item as any).sourceFile : '';
            // Match by title, description, or source file
            if (
              title.toLowerCase().includes(term) || 
              (description && description.toLowerCase().includes(term)) ||
              (sourceFile && sourceFile.toLowerCase().includes(term))
            ) {
              results.push({
                title,
                category: 'industries',
                categoryName,
                assetType,
                fileName: fileName.replace('.json', ''),
                description,
                url: `/assets/industries/${encodeURIComponent(categoryName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName.replace('.json', ''))}`
              });
            }
          });
        }
      });
    });
  }

  // Search products
  if (data.products) {
  Object.entries(data.products as Record<string, Record<string, unknown>>).forEach(([categoryName, product]) => {
      // Search actions, topics, and agents
      ['actions', 'topics', 'agents'].forEach(assetType => {
        const assets = (product as Record<string, Record<string, unknown>>)[assetType] as Record<string, Record<string, unknown>> | undefined;
        if (assets) {
          Object.entries(assets).forEach(([fileName, item]) => {
            const title = fileName.replace('.json', '').replace(/_/g, ' ');
            const description = typeof (item as any).description === 'string' ? (item as any).description : '';
            const sourceFile = typeof (item as any).sourceFile === 'string' ? (item as any).sourceFile : '';
            // Match by title, description, or source file
            if (
              title.toLowerCase().includes(term) || 
              (description && description.toLowerCase().includes(term)) ||
              (sourceFile && sourceFile.toLowerCase().includes(term))
            ) {
              results.push({
                title,
                category: 'products',
                categoryName,
                assetType,
                fileName: fileName.replace('.json', ''),
                description,
                url: `/assets/products/${encodeURIComponent(categoryName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName.replace('.json', ''))}`
              });
            }
          });
        }
      });
    });
  }

  return results;
}
