'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelectedProduct } from '@/context/SelectedProductContext';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { AppData } from '@/types';

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<AppData | null>(null);
  const { setSelectedProduct } = useSelectedProduct();
  const [loading, setLoading] = useState(true);
  
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
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Count available industries and products
  const industryCount = data ? Object.keys(data.industries).length : 0;
  const productCount = data ? Object.keys(data.products).length : 0;

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Agentforce Open Assets Library</h1>
            <p className="text-xl md:text-2xl mb-8">Explore industry-specific and product-specific assets for Agentforce Agents.</p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/products"
                    className="bg-white text-blue-700 font-medium py-3 px-6 rounded-md hover:bg-blue-50"
                  >
                    View Products
                  </Link>
                  <Link 
                    href="/industries"
                    className="bg-transparent border border-white text-white font-medium py-3 px-6 rounded-md hover:bg-blue-700"
                  >
                    View Industries
                  </Link>
                </div>
              </div>
            </div>
        
        {/* Stats Section */}
        <div className="bg-blue-50 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
                <h3 className="text-2xl font-bold text-blue-800">{industryCount}</h3>
                <p className="text-gray-700">Industries Available</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
                <h3 className="text-2xl font-bold text-blue-800">{productCount}</h3>
                <p className="text-gray-700">Products Available</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
                <h3 className="text-2xl font-bold text-blue-800">
                  {loading ? "..." : data ? 
                    Object.values(data.industries).reduce((acc, industry) => 
                      acc + Object.keys(industry.actions).length + 
                      Object.keys(industry.topics).length + 
                      Object.keys(industry.agents).length, 0) +
                    Object.values(data.products).reduce((acc, product) => 
                      acc + Object.keys(product.actions).length + 
                      Object.keys(product.topics).length + 
                      Object.keys(product.agents).length, 0) : 0
                  }
                </h3>
                <p className="text-gray-700">Total Assets</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Choose Products Section */}
        <div className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-800 text-center">Choose your product to see available assets</h2>
            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : data && data.products ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(data.products).map(([product, categoryData]) => (
                  <button
                    key={product}
                    className="bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 p-4 rounded-lg text-center transition-colors w-full"
                    onClick={() => {
                      setSelectedProduct(product);
                      router.push('/products');
                    }}
                  >
                    {categoryData.icon ? (
                      <Image src={categoryData.icon} alt={product + ' icon'} width={48} height={48} className="mx-auto mb-2 h-12 w-12 object-contain" />
                    ) : (
                      <div className="text-3xl mb-2">📦</div>
                    )}
                    <div className="font-medium text-blue-800 capitalize">{product}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No products available</div>
            )}
          </div>
        </div>

        {/* Choose Industries Section */}
        <div className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-800 text-center">Choose your industry to see available assets</h2>
            {loading ? (
              <div className="text-center py-8">Loading industries...</div>
            ) : data && data.industries ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(data.industries).map(([industry, categoryData]) => (
                  <Link 
                    key={industry}
                    href={`/industries#${industry}`}
                    className="bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 p-4 rounded-lg text-center transition-colors"
                  >
                    {categoryData.icon ? (
                      <Image src={categoryData.icon} alt={industry + ' icon'} width={48} height={48} className="mx-auto mb-2 h-12 w-12 object-contain" />
                    ) : (
                      <div className="text-3xl mb-2">🏭</div>
                    )}
                    <div className="font-medium text-blue-800 capitalize">{industry}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No industries available</div>
            )}
          </div>
        </div>
        
        {/* Use Cases Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-800 text-center">Explore asset categories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Actions Card */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-40 bg-blue-600 flex items-center justify-center">
                  <Image 
                    src="/images/action-icon.svg" 
                    alt="Actions" 
                    width={80} 
                    height={80} 
                    className="text-white"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-blue-800">Actions</h3>
                  <p className="text-gray-700 mb-4">Custom actions for Agentforce Agents to perform specialized tasks and integrations.</p>
                  <Link href="/products" className="text-blue-700 hover:text-blue-900 font-medium">
                    View Actions →
                  </Link>
                </div>
              </div>
              
              {/* Topics Card */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-40 bg-green-600 flex items-center justify-center">
                  <Image 
                    src="/images/topic-icon.svg" 
                    alt="Topics" 
                    width={80} 
                    height={80} 
                    className="text-white"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-blue-800">Topics</h3>
                  <p className="text-gray-700 mb-4">Specialized knowledge domains for Agentforce Agents to handle specific conversation areas.</p>
                  <Link href="/products" className="text-blue-700 hover:text-blue-900 font-medium">
                    View Topics →
                  </Link>
                </div>
              </div>
              
              {/* Agents Card */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-40 bg-purple-600 flex items-center justify-center">
                  <Image 
                    src="/images/agent-icon.svg" 
                    alt="Agents" 
                    width={80} 
                    height={80} 
                    className="text-white"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-blue-800">Agents</h3>
                  <p className="text-gray-700 mb-4">Pre-built Agentforce Agents for specific use cases across different industries.</p>
                  <Link href="/industries" className="text-blue-700 hover:text-blue-900 font-medium">
                    View Agents →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Section */}
        <div className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-3 text-blue-800 text-center">Join the Agentblazer community</h2>
            <p className="text-xl text-center text-gray-700 mb-8">Connect with Agentblazers from around the world to skill up on AI, discover use cases, and more.</p>
            
            <div className="flex justify-center">
              <Link 
                href="https://join.slack.com/t/agentblazercommunity/shared_invite/zt-2z08bmdaf-YAVAxnG3dm7VciVT4E0ZCg"
                target="_blank"
                className="bg-blue-700 text-white font-medium py-3 px-6 rounded-md hover:bg-blue-800"
              >
                Join Today
              </Link>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-800 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2 text-blue-800">What is an AI Agent?</h3>
                <p className="text-gray-700">
                  An AI agent is more than just intelligent software. It&apos;s designed to learn and adapt to user interactions 
                  autonomously. This flexibility and continuous learning capability enable it to drive efficiencies while 
                  providing increasingly better support and solutions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2 text-blue-800">What are the benefits of Agentforce?</h3>
                <p className="text-gray-700">
                  Agentforce provides a comprehensive platform for building and deploying AI agents that can handle 
                  complex customer interactions, automate routine tasks, and provide personalized support at scale.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2 text-blue-800">How can I contribute to this library?</h3>
                <p className="text-gray-700">
                  You can contribute to this open assets library by creating and sharing your own actions, topics, and agents. 
                  Follow the documentation to understand the format and submission process.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-blue-900 text-white py-8">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p>© {new Date().getFullYear()} Agentforce Open Assets Library</p>
          </div>
        </div>
      </div>
    </div>
  );
}
