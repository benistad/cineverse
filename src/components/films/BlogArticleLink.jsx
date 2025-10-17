'use client';

import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export default function BlogArticleLink({ url }) {
  const [bgColor, setBgColor] = useState('#DC2625');
  const { t } = useTranslations();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
      style={{ backgroundColor: bgColor }}
      onMouseEnter={() => setBgColor('#B91C1C')}
      onMouseLeave={() => setBgColor('#DC2625')}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
        />
      </svg>
      {t('film.readReview')}
    </a>
  );
}
