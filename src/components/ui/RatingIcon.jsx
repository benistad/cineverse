'use client';

export default function RatingIcon({ rating, className = '', size = 40 }) {
  // Arrondir la note au nombre entier le plus proche
  const roundedRating = Math.round(rating);
  
  // S'assurer que la note est entre 1 et 10
  const validRating = Math.max(1, Math.min(10, roundedRating));
  
  // Définir les couleurs indigo selon la note (dégradé de clair à foncé)
  const getIndigoColor = (rating) => {
    if (rating <= 3) return '#818CF8'; // indigo-400 (notes basses)
    if (rating <= 5) return '#6366F1'; // indigo-500 (notes moyennes-basses)
    if (rating <= 7) return '#4F46E5'; // indigo-600 (notes moyennes)
    if (rating <= 8) return '#4338CA'; // indigo-700 (bonnes notes)
    return '#3730A3'; // indigo-800 (excellentes notes)
  };
  
  const bgColor = getIndigoColor(validRating);
  
  return (
    <div 
      className={`relative inline-flex items-center justify-center rounded-full ${className}`} 
      style={{ 
        width: size, 
        height: size,
        backgroundColor: bgColor,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      <span 
        className="font-bold text-white"
        style={{ fontSize: size * 0.5 }}
      >
        {validRating}
      </span>
    </div>
  );
}
