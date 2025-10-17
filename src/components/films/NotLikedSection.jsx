'use client';

import { useTranslations } from '@/hooks/useTranslations';

/**
 * Composant client pour afficher la section "Ce que nous n'avons pas aimé" traduite
 */
export default function NotLikedSection({ content }) {
  const { t } = useTranslations();

  if (!content) return null;

  return (
    <section className="mb-4 bg-red-50 p-3 sm:p-4 rounded-lg border-l-4 border-red-400">
      <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-red-700">
        {t('film.whatWeDidntLike')}
      </h2>
      <div
        className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap [&>p]:mb-2"
        dangerouslySetInnerHTML={{ __html: content }}
        suppressHydrationWarning
      />
    </section>
  );
}
