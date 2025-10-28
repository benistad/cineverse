'use client';

import QuelFilmRegarder from '@/app/quel-film-regarder/page';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// English version - reuses French component with automatic translations
export default function WhatMovieToWatch() {
  return <QuelFilmRegarder />;
}
