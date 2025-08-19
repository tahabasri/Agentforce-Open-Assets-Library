'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSearch, searchAssets } from '@/context/SearchContext';
import SearchResults from '@/components/SearchResults';
import { GlassNavItem, GlassInput } from '@/components/glass';
import { IconHome, IconProducts, IconIndustries, IconSearch, IconClose, IconMenu, IconExternalLink } from '@/utils/iconUtils';

const categories = [
  { name: 'Home', icon: <IconHome />, path: '/' },
  { name: 'Products', icon: <IconProducts />, path: '/products' },
  { name: 'Industries', icon: <IconIndustries />, path: '/industries' },
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
            <IconMenu />
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
        <div className="mb-8 flex items-center justify-between animate-shimmer">
          <h2 className="text-white text-2xl font-bold">Agentforce Assets</h2>
          {mobileMenuOpen && (
            <button
              className="md:hidden text-white ml-2"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          )}
        </div>
        <div className="space-y-3 mb-6">
          {categories.map((category) => (
            <GlassNavItem 
              key={category.name}
              href={category.path}
              isActive={pathname === category.path}
              icon={category.icon}
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
            icon={<IconSearch />}
          />
        </div>
        <div className="space-y-3 mb-6">
          <div className="border-t border-blue-800 pt-4">
            <div className="text-sm font-medium text-blue-100 mb-2">Quick Links</div>
            <a href="https://developer.salesforce.com/docs/einstein/genai/guide/agent-dx-modify.html" 
               target="_blank" 
               className="flex items-center text-blue-300 hover:text-white mt-2">
              <span className="mr-1"><IconExternalLink /></span>
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
