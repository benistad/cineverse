'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';

export default function SafeImage({ src, alt, fill = false, sizes, className = '', priority = false, width, height, style = {}, ...props }) {
  const [error, setError] = useState(false);

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

  // Render Next.js Image with enforced width/height or fill
  return (
    <Image
      src={src}
      alt={alt || 'Image'}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      onError={() => setError(true)}
      style={style}
      {...props}
    />
  );
}
