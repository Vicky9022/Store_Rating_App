import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ 
  rating, 
  onRatingChange, 
  size = 'md', 
  interactive = false,
  maxRating = 5 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(starRating)}
            disabled={!interactive}
            className={`${
              interactive 
                ? 'hover:scale-110 transition-transform cursor-pointer' 
                : 'cursor-default'
            } ${!interactive ? 'pointer-events-none' : ''}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
      {interactive && (
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Click to rate'}
        </span>
      )}
    </div>
  );
};

export default RatingStars;