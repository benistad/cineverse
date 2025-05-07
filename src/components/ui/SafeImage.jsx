'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';

export default function SafeImage({ src, alt, fill = false, sizes, className = '', priority = false, ...props }) {
  const [error, setError] = useState(false);

  // Si l'URL de l'image est vide ou undefined, afficher un placeholder
  if (!src || error) {
    if (fill) {
      return (
        <div className={`relative w-full h-full flex items-center justify-center bg-gray-200 ${className}`}>
          <FiImage className="text-gray-400" size={48} />
        </div>
      );
    }
    
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`} {...props}>
        <FiImage className="text-gray-400" size={48} />
      </div>
    );
  }

  // Sinon, afficher l'image avec un gestionnaire d'erreur
  return (
    <Image
      src={src}
      alt={alt || "Image"}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setError(true)}
      {...props}
    />
  );
}
