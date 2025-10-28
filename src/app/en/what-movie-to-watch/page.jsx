'use client';

import QuelFilmRegarderContent from '@/components/pages/QuelFilmRegarderContent';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// English version - reuses French component with automatic translations
export default function WhatMovieToWatch() {
  return <QuelFilmRegarderContent />;
}
