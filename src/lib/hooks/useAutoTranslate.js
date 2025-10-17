/**
 * Hook pour traduire automatiquement un film après sa création/modification
 */

import { useCallback } from 'react';

export function useAutoTranslate() {
  /**
   * Traduit automatiquement un film
   * @param {string} filmId - ID du film à traduire
   * @returns {Promise<Object>} Résultat de la traduction
   */
  const translateFilm = useCallback(async (filmId) => {
    if (!filmId) {
      console.warn('No film ID provided for translation');
      return { success: false, error: 'No film ID' };
    }

    try {
      console.log(`🌍 Auto-translating film: ${filmId}`);
      
      const response = await fetch('/api/translate-film', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filmId })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Translation failed:', error);
        return { success: false, error: error.error };
      }

      const result = await response.json();
      console.log(`✅ Film translated successfully (source: ${result.source})`);
      
      return { success: true, ...result };
    } catch (error) {
      console.error('Error during auto-translation:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return { translateFilm };
}
