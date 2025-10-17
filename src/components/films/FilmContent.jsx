'use client';

import { useTranslations } from '@/hooks/useTranslations';

/**
 * Composant client pour afficher le contenu traduit d'un film
 */
export default function FilmContent({ film }) {
  const t = useTranslations();

  return (
    <>
      {/* Synopsis */}
      <section className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
          {t('film.synopsis')}
        </h2>
        <p className="text-sm sm:text-base text-gray-700" itemProp="description">
          {film.synopsis || t('filmCard.noSynopsis')}
        </p>
      </section>

      {/* Pourquoi regarder ce film */}
      {film.why_watch_enabled && film.why_watch_content && (
        <section className="mb-4 bg-indigo-50 p-3 sm:p-4 rounded-lg border-l-4 border-indigo-600">
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-indigo-800">
            {t('film.whyWatch')}
          </h2>
          <div
            className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap [&>p]:mb-2"
            dangerouslySetInnerHTML={{ __html: film.why_watch_content }}
          />
        </section>
      )}
    </>
  );
}
