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
    <div className="mb-6 sm:mb-10 glass p-4 sm:p-6 rounded-xl shadow-lg glass-interactive">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white animate-shimmer mb-2 sm:mb-0">{title}</h2>
        <span className="text-xs sm:text-sm text-white/80 sm:mr-2">Sorted by {sortedBy}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
