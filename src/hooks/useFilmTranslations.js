'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Hook pour charger les traductions de plusieurs films en une seule requête
 * @param {Array} films - Liste des films
 * @returns {Object} - Map des traductions par film_id
 */
export function useFilmTranslations(films) {
  const { locale } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTranslations() {
      console.log('🌍 useFilmTranslations - locale:', locale, 'films count:', films?.length);
      
      if (locale !== 'en' || !films || films.length === 0) {
        setTranslations({});
        return;
      }

      setLoading(true);

      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const filmIds = films.map(f => f.id).filter(Boolean);

        if (filmIds.length === 0) {
          setTranslations({});
          return;
        }

        console.log('📡 Loading translations for', filmIds.length, 'films');

        // Charger toutes les traductions en une seule requête
        const { data, error } = await supabase
          .from('film_translations')
          .select('film_id, title, synopsis, genres')
          .in('film_id', filmIds)
          .eq('locale', 'en');

        if (error) {
          console.error('Error loading translations:', error);
          setTranslations({});
          return;
        }

        console.log('✅ Loaded', data?.length || 0, 'translations');

        // Créer un map pour un accès rapide
        const translationsMap = {};
        data?.forEach(translation => {
          translationsMap[translation.film_id] = translation;
        });

        setTranslations(translationsMap);
      } catch (error) {
        console.error('Error in useFilmTranslations:', error);
        setTranslations({});
      } finally {
        setLoading(false);
      }
    }

    loadTranslations();
  }, [locale, films]);

  return { translations, loading };
}

/**
 * Hook pour obtenir le titre traduit d'un film
 * @param {Object} film - Film
 * @param {Object} translations - Map des traductions
 * @returns {string} - Titre traduit ou original
 */
export function useTranslatedTitle(film, translations) {
  const { locale } = useLanguage();
  
  if (locale !== 'en' || !film || !translations) {
    return film?.title || '';
  }

  const translation = translations[film.id];
  return translation?.title || film?.title || '';
}
