'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';

export default function SafeImage({ src, alt, fill = false, sizes, className = '', priority = false, width, height, style = {}, ...props }) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(false);
  
  // Réinitialiser l'état si la source change
  useEffect(() => {
    if (src !== imageSrc && !hasError) {
      setImageSrc(src);
      setError(false);
    }
  }, [src, imageSrc, hasError]);

  // Warn in development if neither width/height (for non-fill) nor fill+parent aspect ratio is provided
  if (process.env.NODE_ENV !== 'production') {
    if (!fill && (!width || !height)) {
      // eslint-disable-next-line no-console
      console.warn(
        'SafeImage: width and height props are strongly recommended for non-fill images to avoid layout shift.'
      );
    }
  }

  // Placeholder skeleton (for error or missing src)
  if (!src || error) {
    // If fill, use aspect-ratio box; else, use width/height
    if (fill) {
      return (
        <div
          className={className}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: width && height ? `${width} / ${height}` : '16/9', // fallback aspect ratio
            backgroundColor: '#e2e8f0',
            ...style,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              flexDirection: 'column',
            }}
          >
            <FiImage size={48} />
            <span style={{ marginTop: '8px', fontSize: '14px' }}>{alt || 'Image non disponible'}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={className}
          style={{
            width: width || 200,
            height: height || 120,
            backgroundColor: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            flexDirection: 'column',
            ...style,
          }}
        >
          <FiImage size={48} />
          <span style={{ marginTop: '8px', fontSize: '14px' }}>{alt || 'Image non disponible'}</span>
        </div>
      );
    }
  }

  // Vérifier si nous sommes dans la partie admin
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.includes('/admin');
  
  // Si nous sommes dans la partie admin, utiliser directement un élément img standard
  // pour éviter les problèmes avec l'optimiseur d'images de Next.js
  if (isAdmin && !error) {
    // Générer un numéro fixe entre 1 et 5 pour les placeholders (évite les changements aléatoires)
    const placeholderNum = ((width || 0) % 5) + 1; // Utilise width pour générer un nombre déterministe
    const placeholderSrc = `/images/placeholders/movie-${placeholderNum}.jpg`;
    
    return (
      <img
        src={placeholderSrc}
        alt={alt || 'Image'}
        className={className}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          objectFit: 'cover',
          ...style
        }}
        {...props}
      />
    );
  }
  
  // Fonction de gestion d'erreur améliorée
  const handleImageError = () => {
    // Si nous sommes dans la partie admin, utiliser directement une image placeholder
    if (isAdmin) {
      setError(true);
      return;
    }
    
    // Pour les autres parties du site, essayer des tailles alternatives
    if (!hasError && src && typeof src === 'string' && src.includes('image.tmdb.org/t/p/')) {
      console.warn(`Tentative de récupération d'une taille alternative pour l'image TMDB: ${src}`);
      
      // Essayer avec une taille d'image plus petite
      let newSrc;
      if (src.includes('/w500/')) {
        newSrc = src.replace('/w500/', '/w342/');
      } else if (src.includes('/w1280/')) {
        newSrc = src.replace('/w1280/', '/w780/');
      } else if (src.includes('/original/')) {
        newSrc = src.replace('/original/', '/w780/');
      }
      
      if (newSrc && newSrc !== src) {
        console.log('Tentative avec une taille d\'image alternative:', newSrc);
        setImageSrc(newSrc);
        setHasError(true);
        return;
      }
    }
    
    // Si ce n'est pas une URL TMDB ou si la tentative alternative échoue
    setError(true);
  };

  // Render Next.js Image with enforced width/height or fill
  return (
    <Image
      src={imageSrc}
      alt={alt || 'Image'}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      onError={handleImageError}
      style={style}
      {...props}
    />
  );
}
