'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSearch, searchAssets } from '@/context/SearchContext';
import SearchResults from '@/components/SearchResults';
import { GlassNavItem, GlassInput } from '@/components/glass';

const categories = [
  { name: 'Home', icon: '🏠', path: '/' },
  { name: 'Products', icon: '📦', path: '/products' },
  { name: 'Industries', icon: '🏭', path: '/industries' },
];

export default function Navigation() {
  const { searchTerm, setSearchTerm, setSearchResults } = useSearch();
  const pathname = usePathname();
  const [data, setData] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Determine if we're on the industries or products page
  const isIndustriesPage = pathname === '/industries';
  const isProductsPage = pathname === '/products';
  const isFilterPage = isIndustriesPage || isProductsPage;
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Fetch data for search
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching data for search:', error);
      }
    };
    fetchData();
  }, []);
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    // Only show search results if we have a search term and we're not on a filter page
    setShowSearchResults(newSearchTerm.trim().length > 0 && !isFilterPage);
    
    // Update search results if we have data
    if (data) {
      const results = searchAssets(data, newSearchTerm);
      setSearchResults(results);
    }
  };
  
  return (
    <>
      {/* Mobile Menu Button: only show when menu is closed */}
      {!mobileMenuOpen && (
        <div className="md:hidden fixed top-4 left-4 z-30">
          <button
            className="glass-interactive rounded-lg p-2 text-white"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation Sidebar */}
      <div 
        ref={menuRef}
  className={`glass-intense fixed md:relative z-20 top-0 left-0 w-72 p-6 min-h-screen backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header with title and close button, only one X button, right-aligned */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold animate-shimmer">Agentforce</h2>
          {mobileMenuOpen && (
            <button
              className="md:hidden text-white ml-2"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="space-y-3 mb-6">
          {categories.map((category) => (
            <GlassNavItem 
              key={category.name}
              href={category.path}
              isActive={pathname === category.path}
              icon={<span>{category.icon}</span>}
            >
              {category.name}
            </GlassNavItem>
          ))}
        </div>
        <div className="mb-6">
          <GlassInput 
            type="text"
            placeholder={isFilterPage ? "Filter assets..." : "Search assets..."}
            value={searchTerm}
            onChange={handleSearchChange}
            icon={
              <svg 
                className="h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div className="space-y-3 mb-6">
          <div className="border-t border-blue-800 pt-4">
            <div className="text-sm font-medium text-blue-100 mb-2">Quick Links</div>
            <a href="https://developer.salesforce.com/docs/einstein/genai/guide/agent-dx-modify.html" 
               target="_blank" 
               className="flex items-center text-blue-300 hover:text-white mt-2">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
              </svg>
              Developer Documentation
            </a>
          </div>
        </div>
        {/* Show search results if not on industries or products page, now below Quick Links */}
        {showSearchResults && !isFilterPage && (
          <div className="mb-6">
            <SearchResults />
          </div>
        )}
      </div>
      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
