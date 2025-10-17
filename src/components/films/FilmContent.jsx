'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Composant client pour afficher le contenu traduit d'un film
 */
export default function FilmContent({ film: initialFilm }) {
  const { t, locale } = useTranslations();
  const [film, setFilm] = useState(initialFilm);
  const [isClient, setIsClient] = useState(false);

  // Marquer qu'on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger les traductions quand la locale change
  useEffect(() => {
    if (!isClient) return;
    
    async function loadTranslation() {
      if (locale === 'en' && initialFilm?.id) {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: translation } = await supabase
          .from('film_translations')
          .select('*')
          .eq('film_id', initialFilm.id)
          .eq('locale', 'en')
          .single();

        if (translation) {
          setFilm({
            ...initialFilm,
            synopsis: translation.synopsis || initialFilm.synopsis,
            why_watch_content: translation.why_watch_content || initialFilm.why_watch_content
          });
        }
      } else {
        setFilm(initialFilm);
      }
    }

    loadTranslation();
  }, [locale, initialFilm?.id, isClient]);

  return (
    <>
      {/* Synopsis */}
      <section className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
          {t('film.synopsis')}
        </h2>
        <p className="text-sm sm:text-base text-gray-700" itemProp="description">
          {film?.synopsis || t('filmCard.noSynopsis')}
        </p>
      </section>

      {/* Pourquoi regarder ce film */}
      {film?.why_watch_enabled && film?.why_watch_content && (
        <section className="mb-4 bg-indigo-50 p-3 sm:p-4 rounded-lg border-l-4 border-indigo-600">
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-indigo-800">
            {t('film.whyWatch')}
          </h2>
          <div
            className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap [&>p]:mb-2"
            dangerouslySetInnerHTML={{ __html: film.why_watch_content }}
            suppressHydrationWarning
          />
        </section>
      )}
    </>
  );
}
