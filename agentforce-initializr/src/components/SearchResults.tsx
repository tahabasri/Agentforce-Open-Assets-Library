'use client';

import Link from 'next/link';
import { toSentenceCase } from '@/utils/stringUtils';
import { useSearch } from '@/context/SearchContext';

export default function SearchResults() {
  const { searchResults } = useSearch();
  
  if (searchResults.length === 0) {
    return (
      <div className="bg-blue-800 rounded-md p-3 mt-2">
        <p className="text-blue-100 text-sm">No results found</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-800 rounded-md p-3 mt-2 max-h-96 overflow-y-auto">
      <h3 className="text-white text-sm font-semibold mb-2">Search Results</h3>
      <ul className="space-y-2">
        {searchResults.map((result, index) => (
          <li key={index}>
            <Link 
              href={result.url} 
              className="block p-2 hover:bg-blue-700 rounded-md transition-colors"
            >
              <p className="text-white font-medium">{toSentenceCase(result.title)}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded mr-1">
                  {toSentenceCase(result.categoryName)}
                </span>
                <span className="text-xs text-blue-300">
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
