'use client';

import Link from 'next/link';
import Card from './Card';
import { ActionFile } from '@/types';
import { toSentenceCase } from '@/utils/stringUtils';

interface SectionProps {
  title: string;
  sortedBy?: string;
  items: Record<string, ActionFile>;
  defaultImage?: string;
}

export default function Section({ title, sortedBy = 'Most Popular', items, defaultImage }: SectionProps) {
  return (
    <div className="mb-10 glass p-6 rounded-xl shadow-lg glass-interactive">
      <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-3">
        <h2 className="text-2xl font-bold text-white animate-shimmer">{title}</h2>
        <div className="flex items-center">
          <span className="text-sm text-white/80 mr-2">Sorted by {sortedBy}</span>
          <Link href={`/more/${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-white/90 hover:text-white hover:underline flex items-center font-medium">
            More in {title}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(items).length > 0 ? (
          Object.entries(items).slice(0, 4).map(([fileName, item]) => {
            const fileNameWithoutExt = fileName.replace('.json', '');
            // Build relative URL for asset (industry/product/type/filename)
            let assetUrl = '';
            // Build URL: /assets/[category]/[categoryName]/[assetType]/[fileName]
            const encode = (val: string | string[]) => Array.isArray(val) ? val.map(encodeURIComponent).join('/') : encodeURIComponent(val);
            const segments = [item.category, item.categoryName, item.assetType, fileName.replace('.json', '')]
              .filter((seg): seg is string | string[] => typeof seg !== 'undefined' && seg !== null && seg !== '')
              .map(encode);
            assetUrl = `/assets/${segments.join('/')}`;
            return (
              <Link
                key={fileNameWithoutExt}
                href={assetUrl}
                className="block"
              >
                <Card
                  title={toSentenceCase(fileNameWithoutExt.replace(/_/g, ' '))}
                  description={Array.isArray(item.description) ? item.description.join(', ') : (item.description || '')}
                  imageSrc={defaultImage}
                  author={item.author}
                  company={item.company}
                  dependencies={item.dependencies}
                />
              </Link>
            );
          })
        ) : (
          <p className="col-span-2 text-white/70">No items found in this category.</p>
        )}
      </div>
    </div>
  );
}
