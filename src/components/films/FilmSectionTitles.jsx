'use client';

import { useTranslations } from '@/hooks/useTranslations';

/**
 * Composant client pour les titres de sections traduits
 */
export function TrailerSectionTitle() {
  const t = useTranslations();
  return <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('film.trailer')}</h2>;
}

export function RemarkableStaffTitle() {
  const t = useTranslations();
  return <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{t('film.remarkableStaff')}</h2>;
}

export function SimilarFilmsTitle() {
  const t = useTranslations();
  return <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{t('film.similarFilms')}</h2>;
}

export function WhereToWatchTitle() {
  const t = useTranslations();
  return <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('film.whereToWatch')}</h2>;
}

export function AddedOnLabel() {
  const t = useTranslations();
  return <span className="font-semibold">{t('film.addedOn')}:</span>;
}

export function GenreLabel() {
  const t = useTranslations();
  return <span className="font-semibold">{t('film.genre')}:</span>;
}
