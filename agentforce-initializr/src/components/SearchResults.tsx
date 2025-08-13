'use client';

import Link from 'next/link';
import { toSentenceCase } from '@/utils/stringUtils';
import { useSearch } from '@/context/SearchContext';

export default function SearchResults() {
  const { searchResults } = useSearch();
  
  if (searchResults.length === 0) {
    return (
      <div className="glass-intense rounded-lg p-3 mt-2">
        <p className="text-white/80 text-sm">No results found</p>
      </div>
    );
  }

  return (
    <div className="glass-intense rounded-lg p-3 mt-2 max-h-96 overflow-y-auto border border-white/20 shadow-lg">
      <h3 className="text-white text-sm font-semibold mb-2">Search Results</h3>
      <ul className="space-y-2">
        {searchResults.map((result, index) => (
          <li key={index}>
            <Link 
              href={result.url} 
              className="block p-2 hover:bg-white/10 rounded-lg transition-all glass-interactive"
            >
              <p className="text-white font-medium">{toSentenceCase(result.title)}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs bg-white/10 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-md mr-1">
                  {toSentenceCase(result.categoryName)}
                </span>
                <span className="text-xs text-white/80">
                  {result.assetType}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
