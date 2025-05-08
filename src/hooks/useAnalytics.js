'use client';

/**
 * Hook personnalisé pour utiliser Google Analytics
 * Permet de suivre facilement les événements dans toute l'application
 */
export default function useAnalytics() {
  // Fonction pour suivre une page vue
  const pageView = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  };

  // Fonction pour suivre un événement
  const event = ({ action, category, label, value }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Événements spécifiques pour MovieHunt
  const filmView = (filmId, filmTitle) => {
    event({
      action: 'view_film',
      category: 'films',
      label: filmTitle,
      value: filmId,
    });
  };

  const filmSearch = (searchTerm) => {
    event({
      action: 'search',
      category: 'films',
      label: searchTerm,
    });
  };

  const ratingSubmit = (filmId, filmTitle, rating) => {
    event({
      action: 'submit_rating',
      category: 'engagement',
      label: `${filmTitle} (${filmId})`,
      value: rating,
    });
  };

  return {
    pageView,
    event,
    filmView,
    filmSearch,
    ratingSubmit,
  };
}
