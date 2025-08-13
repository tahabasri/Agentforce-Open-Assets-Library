'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ActionFile } from '@/types';

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
  data: any,
  searchTerm: string
): SearchResult[] {
  if (!data || !searchTerm || searchTerm.trim() === '') return [];
  
  const term = searchTerm.toLowerCase();
  const results: SearchResult[] = [];

  // Search industries
  if (data.industries) {
    Object.entries(data.industries).forEach(([categoryName, industry]: [string, any]) => {
      // Search actions, topics, and agents
      ['actions', 'topics', 'agents'].forEach(assetType => {
        if (industry[assetType]) {
          Object.entries(industry[assetType]).forEach(([fileName, item]: [string, any]) => {
            const title = fileName.replace('.json', '').replace(/_/g, ' ');
            
            // Match by title, description, or source file
            if (
              title.toLowerCase().includes(term) || 
              (item.description && String(item.description).toLowerCase().includes(term)) ||
              (item.sourceFile && item.sourceFile.toLowerCase().includes(term))
            ) {
              results.push({
                title,
                category: 'industries',
                categoryName,
                assetType,
                fileName: fileName.replace('.json', ''),
                description: item.description || '',
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
    Object.entries(data.products).forEach(([categoryName, product]: [string, any]) => {
      // Search actions, topics, and agents
      ['actions', 'topics', 'agents'].forEach(assetType => {
        if (product[assetType]) {
          Object.entries(product[assetType]).forEach(([fileName, item]: [string, any]) => {
            const title = fileName.replace('.json', '').replace(/_/g, ' ');
            
            // Match by title, description, or source file
            if (
              title.toLowerCase().includes(term) || 
              (item.description && String(item.description).toLowerCase().includes(term)) ||
              (item.sourceFile && item.sourceFile.toLowerCase().includes(term))
            ) {
              results.push({
                title,
                category: 'products',
                categoryName,
                assetType,
                fileName: fileName.replace('.json', ''),
                description: item.description || '',
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
