'use client';

import { useTranslations } from '@/hooks/useTranslations';

/**
 * Composant client pour les titres de sections traduits
 */
export function TrailerSectionTitle() {
  const { t } = useTranslations();
  return <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('film.trailer')}</h2>;
}

export function RemarkableStaffTitle({ filmTitle }) {
  const { t } = useTranslations();
  return (
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
      {t('film.remarkableStaffOf')} {filmTitle || t('filmCard.noTitle')}
    </h2>
  );
}

export function SimilarFilmsTitle({ filmTitle }) {
  const { t } = useTranslations();
  return (
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
      {t('film.similarFilmsTo')} {filmTitle || t('filmCard.noTitle')}
    </h2>
  );
}

export function WhereToWatchTitle() {
  const { t } = useTranslations();
  return <h2 className="text-lg sm:text-xl font-semibold mb-2">{t('film.whereToWatch')}</h2>;
}

export function AddedOnLabel() {
  const { t } = useTranslations();
  return <span className="font-semibold">{t('film.addedOn')}:</span>;
}

export function GenreLabel() {
  const { t } = useTranslations();
  return <span className="font-semibold">{t('film.genre')}:</span>;
}
