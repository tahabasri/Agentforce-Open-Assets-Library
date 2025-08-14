'use client';

import Image from 'next/image';

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
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating) ? 'text-yellow-300 animate-pulse-glow' : 'text-white/30'
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
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
            <Image
              src={imageSrc}
              alt={title}
              width={48}
              height={48}
              className="object-contain"
            />
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
          <a href={href} className="inline-block mt-2 text-xs text-white/60 hover:underline">View details →</a>
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
