'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';

export default function SafeImage({ src, alt, fill = false, sizes, className = '', priority = false, ...props }) {
  const [error, setError] = useState(false);

  // Si l'URL de l'image est vide ou undefined, ou s'il y a eu une erreur de chargement
  if (!src || error) {
    // Créer un placeholder basé sur un div avec un arrière-plan coloré
    const placeholderStyle = {
      backgroundColor: '#e2e8f0', // Couleur de fond gris clair
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8', // Couleur de texte gris
      position: fill ? 'absolute' : 'relative',
      inset: fill ? 0 : 'auto',
      width: fill ? '100%' : props.width || '100%',
      height: fill ? '100%' : props.height || '100%',
    };

    return (
      <div style={placeholderStyle} className={className}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FiImage size={48} />
          <span style={{ marginTop: '8px', fontSize: '14px' }}>
            {alt || 'Image non disponible'}
          </span>
        </div>
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
      loading={priority ? "eager" : "lazy"}
      onError={() => setError(true)}
      {...props}
    />
  );
}
