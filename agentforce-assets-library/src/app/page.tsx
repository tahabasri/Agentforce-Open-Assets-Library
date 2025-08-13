'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelectedProduct } from '@/context/SelectedProductContext';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { AppData } from '@/types';
import { getStaticData } from '@/utils/staticData';

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<AppData | null>(null);
  const { setSelectedProduct } = useSelectedProduct();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getStaticData();
        setData(result);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  // Count available industries and products
  const industryCount = data ? Object.keys(data.industries).length : 0;
  const productCount = data ? Object.keys(data.products).length : 0;

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="glass-intense text-white py-16 border-b border-white/20">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-shimmer">Agentforce Open Assets Library</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">Explore industry-specific and product-specific assets for Agentforce Agents.</p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/products"
                    className="glass-interactive bg-white/20 backdrop-blur-lg text-white font-medium py-3 px-6 rounded-lg border border-white/30 hover:bg-white/30"
                  >
                    View Products
                  </Link>
                  <Link 
                    href="/industries"
                    className="glass-interactive bg-transparent border border-white/20 text-white font-medium py-3 px-6 rounded-lg hover:bg-white/10"
                  >
                    View Industries
                  </Link>
                </div>
              </div>
            </div>
        
        {/* Stats Section */}
        <div className="py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-xl animate-float">
                <h3 className="text-2xl font-bold text-white">{industryCount}</h3>
                <p className="text-white/80">Industries Available</p>
              </div>
              <div className="glass p-6 rounded-xl animate-float" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-2xl font-bold text-white">{productCount}</h3>
                <p className="text-white/80">Products Available</p>
              </div>
              <div className="glass p-6 rounded-xl animate-float" style={{ animationDelay: '1s' }}>
                <h3 className="text-2xl font-bold text-white">
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
                <p className="text-white/80">Total Assets</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Choose Products Section */}
        <div className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-white text-center animate-shimmer">Choose your product to see available assets</h2>
            {loading ? (
              <div className="glass-intense text-center py-8 text-white/80">Loading products...</div>
            ) : data && data.products ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(data.products).map(([product, categoryData]) => (
                  <button
                    key={product}
                    className="glass-interactive glass p-4 rounded-xl text-center transition-all w-full animate-float"
                    onClick={() => {
                      setSelectedProduct(product);
                      router.push('/products');
                    }}
                  >
                    {categoryData.icon ? (
                      <Image src={categoryData.icon} alt={product + ' icon'} width={48} height={48} className="mx-auto mb-2 h-12 w-12 object-contain animate-float" />
                    ) : (
                      <div className="text-3xl mb-2">📦</div>
                    )}
                    <div className="font-medium text-white capitalize">{product}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="glass-intense text-center py-8 text-white/80">No products available</div>
            )}
          </div>
        </div>

        {/* Choose Industries Section */}
        <div className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-white text-center animate-shimmer">Choose your industry to see available assets</h2>
            {loading ? (
              <div className="glass-intense text-center py-8 text-white/80">Loading industries...</div>
            ) : data && data.industries ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(data.industries).map(([industry, categoryData]) => (
                  <Link 
                    key={industry}
                    href={`/industries#${industry}`}
                    className="glass-interactive glass p-4 rounded-xl text-center transition-all animate-float"
                  >
                    {categoryData.icon ? (
                      <Image src={categoryData.icon} alt={industry + ' icon'} width={48} height={48} className="mx-auto mb-2 h-12 w-12 object-contain animate-float" />
                    ) : (
                      <div className="text-3xl mb-2">🏭</div>
                    )}
                    <div className="font-medium text-white capitalize">{industry}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-intense text-center py-8 text-white/80">No industries available</div>
            )}
          </div>
        </div>
        
        {/* Use Cases Section */}
        <div className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-white text-center animate-shimmer">Explore asset categories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Actions Card */}
              <div className="glass-interactive glass rounded-xl overflow-hidden animate-float">
                <div className="h-40 bg-blue-600/70 backdrop-blur-md flex items-center justify-center">
                  <Image 
                    src="/images/action-icon.svg" 
                    alt="Actions" 
                    width={80} 
                    height={80} 
                    className="text-white animate-pulse-glow"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">Actions</h3>
                  <p className="text-white/80 mb-4">Custom actions for Agentforce Agents to perform specialized tasks and integrations.</p>
                  <Link href="/products" className="text-white/90 hover:text-white font-medium">
                    View Actions →
                  </Link>
                </div>
              </div>
              
              {/* Topics Card */}
              <div className="glass-interactive glass rounded-xl overflow-hidden animate-float" style={{ animationDelay: '0.3s' }}>
                <div className="h-40 bg-green-600/70 backdrop-blur-md flex items-center justify-center">
                  <Image 
                    src="/images/topic-icon.svg" 
                    alt="Topics" 
                    width={80} 
                    height={80} 
                    className="text-white animate-pulse-glow"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">Topics</h3>
                  <p className="text-white/80 mb-4">Specialized knowledge domains for Agentforce Agents to handle specific conversation areas.</p>
                  <Link href="/products" className="text-white/90 hover:text-white font-medium">
                    View Topics →
                  </Link>
                </div>
              </div>
              
              {/* Agents Card */}
              <div className="glass-interactive glass rounded-xl overflow-hidden animate-float" style={{ animationDelay: '0.6s' }}>
                <div className="h-40 bg-purple-600/70 backdrop-blur-md flex items-center justify-center">
                  <Image 
                    src="/images/agent-icon.svg" 
                    alt="Agents" 
                    width={80} 
                    height={80} 
                    className="text-white animate-pulse-glow"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">Agents</h3>
                  <p className="text-white/80 mb-4">Pre-built Agentforce Agents for specific use cases across different industries.</p>
                  <Link href="/industries" className="text-white/90 hover:text-white font-medium">
                    View Agents →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Section */}
        <div className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-3 text-white text-center animate-shimmer">Join the Agentblazer community</h2>
            <p className="text-xl text-center text-white/80 mb-8">Connect with Agentblazers from around the world to skill up on AI, discover use cases, and more.</p>
            
            <div className="flex justify-center">
              <Link 
                href="https://join.slack.com/t/agentblazercommunity/shared_invite/zt-2z08bmdaf-YAVAxnG3dm7VciVT4E0ZCg"
                target="_blank"
                className="glass-interactive glass-intense text-white font-medium py-3 px-6 rounded-lg border border-white/30 hover:bg-white/20"
              >
                Join Today
              </Link>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-white text-center animate-shimmer">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="glass p-6 rounded-xl glass-interactive animate-float">
                <h3 className="text-xl font-bold mb-2 text-white">What is an AI Agent?</h3>
                <p className="text-white/80">
                  An AI agent is more than just intelligent software. It&apos;s designed to learn and adapt to user interactions 
                  autonomously. This flexibility and continuous learning capability enable it to drive efficiencies while 
                  providing increasingly better support and solutions.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl glass-interactive animate-float" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold mb-2 text-white">What are the benefits of Agentforce?</h3>
                <p className="text-white/80">
                  Agentforce provides a comprehensive platform for building and deploying AI agents that can handle 
                  complex customer interactions, automate routine tasks, and provide personalized support at scale.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl glass-interactive animate-float" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-xl font-bold mb-2 text-white">How can I contribute to this library?</h3>
                <p className="text-white/80">
                  You can contribute to this open assets library by creating and sharing your own actions, topics, and agents. 
                  Follow the documentation to understand the format and submission process.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="glass-intense py-8 mt-12 border-t border-white/20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-white/80">© {new Date().getFullYear()} Agentforce Open Assets Library</p>
          </div>
        </div>
      </div>
    </div>
  );
}
