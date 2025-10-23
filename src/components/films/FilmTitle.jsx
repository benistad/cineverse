'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Composant client pour afficher le titre traduit du film
 */
export default function FilmTitle({ title: initialTitle, filmId }) {
  const { locale } = useLanguage();
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    async function loadTranslatedTitle() {
      if (locale === 'en' && filmId) {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: translation } = await supabase
          .from('film_translations')
          .select('title')
          .eq('film_id', filmId)
          .eq('locale', 'en')
          .single();

        if (translation?.title) {
          setTitle(translation.title);
        } else {
          setTitle(initialTitle);
        }
      } else {
        setTitle(initialTitle);
      }
    }

    loadTranslatedTitle();
  }, [locale, filmId, initialTitle]);

  return (
    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
      {title}
    </h1>
  );
}
