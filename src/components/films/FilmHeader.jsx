'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Composant client pour afficher l'année et les genres traduits dans le header
 */
export default function FilmHeader({ releaseDate, genres: initialGenres, filmId }) {
  const { locale } = useLanguage();
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
    <div className="flex flex-wrap items-center mb-4 text-gray-700">
      {releaseDate && (
        <span className="mr-3" itemProp="datePublished">
          {new Date(releaseDate).getFullYear()}
        </span>
      )}
      {genres && (
        <span itemProp="genre">
          {genres}
        </span>
      )}
    </div>
  );
}
