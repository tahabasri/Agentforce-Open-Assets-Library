'use client';

import { useEffect, useState } from 'react';
import Section from '@/components/Section';
import { AppData } from '@/types';

export default function Dashboard() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-white text-blue-800 font-bold text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-red-50 text-red-700 border border-red-300 p-4 rounded-lg">Error: {error}</div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen bg-yellow-50 text-yellow-800 border border-yellow-300 p-4 rounded-lg">No data available</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-800 bg-blue-50 p-4 rounded-lg border border-blue-200 inline-block">Explore by Products</h1>

      {/* Industries Sections */}
      {Object.entries(data.industries).map(([industry, categoryData]) => (
        <div key={`industry-${industry}`} className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 capitalize border-b-2 border-blue-300 pb-2">{industry}</h2>
          
          {/* Actions Section */}
          {Object.keys(categoryData.actions).length > 0 && (
            <Section 
              title={`${industry} Actions`} 
              sortedBy="Most Popular" 
              items={categoryData.actions}
              defaultImage="/images/action-icon.svg"
            />
          )}
          
          {/* Topics Section */}
          {Object.keys(categoryData.topics).length > 0 && (
            <Section 
              title={`${industry} Topics`} 
              sortedBy="Most Popular" 
              items={categoryData.topics}
              defaultImage="/images/topic-icon.svg"
            />
          )}
          
          {/* Agents Section */}
          {Object.keys(categoryData.agents).length > 0 && (
            <Section 
              title={`${industry} Agents`} 
              sortedBy="Most Popular" 
              items={categoryData.agents}
              defaultImage="/images/agent-icon.svg"
            />
          )}
        </div>
      ))}

      {/* Products Sections */}
      {Object.entries(data.products).map(([product, categoryData]) => (
        <div key={`product-${product}`} className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 capitalize border-b-2 border-blue-300 pb-2">{product}</h2>
          
          {/* Actions Section */}
          {Object.keys(categoryData.actions).length > 0 && (
            <Section 
              title={`${product} Actions`} 
              sortedBy="Most Popular" 
              items={categoryData.actions}
              defaultImage="/images/action-icon.svg"
            />
          )}
          
          {/* Topics Section */}
          {Object.keys(categoryData.topics).length > 0 && (
            <Section 
              title={`${product} Topics`} 
              sortedBy="Most Popular" 
              items={categoryData.topics}
              defaultImage="/images/topic-icon.svg"
            />
          )}
          
          {/* Agents Section */}
          {Object.keys(categoryData.agents).length > 0 && (
            <Section 
              title={`${product} Agents`} 
              sortedBy="Most Popular" 
              items={categoryData.agents}
              defaultImage="/images/agent-icon.svg"
            />
          )}
        </div>
      ))}
    </div>
  );
}
