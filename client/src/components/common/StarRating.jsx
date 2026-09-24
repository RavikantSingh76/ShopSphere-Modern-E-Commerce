import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const StarRating = ({ rating = 0, reviewCount, size = 'sm', interactive = false, onRatingChange }) => {
  const iconSize = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.3 && rating - fullStars < 0.8;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => {
          if (interactive) {
            return (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange && onRatingChange(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`${iconSize} ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          }

          if (star <= fullStars) {
            return <Star key={star} className={`${iconSize} fill-amber-400 text-amber-400`} />;
          } else if (star === fullStars + 1 && hasHalfStar) {
            return <StarHalf key={star} className={`${iconSize} fill-amber-400 text-amber-400`} />;
          } else if (star <= rating) {
            return <Star key={star} className={`${iconSize} fill-amber-400 text-amber-400`} />;
          } else {
            return <Star key={star} className={`${iconSize} text-slate-300`} />;
          }
        })}
      </div>

      {!interactive && rating > 0 && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}

      {!interactive && reviewCount !== undefined && (
        <span className="text-xs text-slate-400">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
