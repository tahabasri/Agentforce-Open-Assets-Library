'use client';

import Image from 'next/image';
import { IconStar, IconExternalLink } from '@/utils/iconUtils';
import AssetIcon from '@/components/AssetIcon';

interface StarRatingProps {
  rating: number;
  count: number;
}

interface CardProps {
  title: string;
  description: string;
  imageSrc?: string;
  rating?: StarRatingProps;
  author?: string;
  company?: string;
  dependencies?: string[];
  href?: string;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, count }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-yellow-300 animate-pulse-glow' : 'text-white/30'}>
          <IconStar />
        </span>
      ))}
      <span className="ml-1 text-sm font-medium text-white/90">
        {rating.toFixed(2)} ({count})
      </span>
    </div>
  );
};

export default function Card({
  title,
  description,
  imageSrc,
  rating,
  author,
  company,
  dependencies,
  href,
  className = "glass"
}: CardProps) {
  const cardContent = (
    <div className="flex flex-col sm:flex-row p-4 sm:p-6 mb-4 transition-all">
      {imageSrc && (
        <div className="mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 flex sm:block justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600/30 glass-light rounded-lg overflow-hidden flex items-center justify-center animate-float">
{imageSrc.includes('action-icon.svg') ? (
              <AssetIcon assetType="actions" width={48} height={48} />
            ) : imageSrc.includes('topic-icon.svg') ? (
              <AssetIcon assetType="topics" width={48} height={48} />
            ) : imageSrc.includes('agent-icon.svg') ? (
              <AssetIcon assetType="agents" width={48} height={48} />
            ) : (
              <Image
                src={imageSrc}
                alt={title}
                width={48}
                height={48}
                className="object-contain"
              />
            )}
          </div>
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-lg sm:text-xl font-semibold text-white truncate">{title}</h3>
        {author && (
          <p className="text-xs sm:text-sm text-white/80"><span className="font-semibold">Author:</span> {author}</p>
        )}
        {company && (
          <p className="text-xs sm:text-sm text-white/80"><span className="font-semibold">Company:</span> {company}</p>
        )}
        {dependencies && (
          <p className="text-xs sm:text-sm text-white/80 mb-2">
            <span className="font-semibold">Integration Difficulty:</span> {
              (() => {
                const count = dependencies.length;
                const depWord = count === 1 ? 'dependency' : 'dependencies';
                if (count < 5) return `Easy (${count} ${depWord})`;
                if (count <= 15) return `Moderate (${count} ${depWord})`;
                return `Complex (${count} ${depWord})`;
              })()
            }
          </p>
        )}
        {/* View details button below Integration Difficulty */}
        {href && (
          <a href={href} className="inline-flex items-center gap-1 mt-2 text-xs text-white/60 hover:underline">
            View details <IconExternalLink />
          </a>
        )}
        {rating && <StarRating rating={rating.rating} count={rating.count} />}
        <p className="mt-2 text-xs sm:text-sm text-white/90 line-clamp-2 sm:line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className={`block rounded-xl transition-all shadow-lg hover:scale-105 ${className}`}>
      {cardContent}
    </a>
  ) : (
    <div className={`block rounded-xl transition-all shadow-lg hover:scale-105 ${className}`}>
      {cardContent}
    </div>
  );
}
