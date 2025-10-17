'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Composant client pour afficher les métadonnées traduites d'un film
 */
export default function FilmMetadata({ dateAjout, genres: initialGenres, filmId }) {
  const { t, locale } = useTranslations();
  const [genres, setGenres] = useState(initialGenres);

  useEffect(() => {
    async function loadTranslatedGenres() {
      if (locale === 'en' && filmId) {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: translation } = await supabase
          .from('film_translations')
          .select('genres')
          .eq('film_id', filmId)
          .eq('locale', 'en')
          .single();

        if (translation?.genres) {
          setGenres(translation.genres);
        } else {
          setGenres(initialGenres);
        }
      } else {
        setGenres(initialGenres);
      }
    }

    loadTranslatedGenres();
  }, [locale, filmId, initialGenres]);

  return (
    <>
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">{t('film.addedOn')}:</span> {new Date(dateAjout).toLocaleDateString('fr-FR')}
      </p>
      
      {genres && (
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">{t('film.genre')}:</span> {genres}
        </p>
      )}
    </>
  );
}
