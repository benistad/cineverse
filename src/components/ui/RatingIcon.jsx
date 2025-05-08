'use client';

import Image from 'next/image';

export default function RatingIcon({ rating, className = '', size = 40 }) {
  // Arrondir la note au nombre entier le plus proche
  const roundedRating = Math.round(rating);
  
  // S'assurer que la note est entre 1 et 10
  const validRating = Math.max(1, Math.min(10, roundedRating));
  
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <Image
        src={`/images/rating-icons/icon-${validRating}.svg`}
        alt={`Note: ${validRating}/10`}
        width={size}
        height={size}
        className="w-full h-full"
      />
    </div>
  );
}
