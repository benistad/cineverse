'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * SmartImage - Un composant d'image intelligent qui ajuste la position de l'image
 * pour éviter que les visages soient coupés dans les carrousels et autres affichages.
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.src - L'URL de l'image
 * @param {string} props.alt - Le texte alternatif de l'image
 * @param {boolean} props.fill - Si l'image doit remplir son conteneur
 * @param {string} props.className - Classes CSS additionnelles
 * @param {string} props.sizes - Tailles responsives pour l'image
 * @param {boolean} props.priority - Si l'image doit être chargée en priorité
 * @param {boolean} props.unoptimized - Si l'image ne doit pas être optimisée
 * @param {string} props.focusPosition - Position de focus par défaut (ex: "center 33%")
 * @param {Object} props.imageProps - Autres propriétés à passer au composant Image
 */
export default function SmartImage({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  sizes = '100vw',
  priority = false,
  unoptimized = false,
  focusPosition = 'center 33%',
  imageProps = {},
  ...rest
}) {
  const [imagePosition, setImagePosition] = useState(focusPosition);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Classe CSS pour l'objet-fit et la position
  const imageClasses = `${className} ${fill ? 'object-cover' : ''}`.trim();
  
  // Style pour la position de l'objet
  const imageStyle = {
    objectPosition: imagePosition,
    ...imageProps.style,
  };

  // Gestionnaire de chargement de l'image
  const handleImageLoad = (e) => {
    setImageLoaded(true);
    if (imageProps.onLoad) {
      imageProps.onLoad(e);
    }
  };

  return (
    <Image
      src={src || '/images/placeholder.jpg'}
      alt={alt || 'Image'}
      fill={fill}
      className={imageClasses}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      unoptimized={unoptimized}
      style={imageStyle}
      onLoad={handleImageLoad}
      {...imageProps}
      {...rest}
    />
  );
}
