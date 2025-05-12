'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FilmPage from '../page';

export default function FilmPageWithSlug() {
  const params = useParams();
  const router = useRouter();
  const { id, slug } = params;

  // Ce composant réutilise simplement le composant FilmPage existant
  // mais permet d'avoir des URLs plus descriptives pour le SEO
  return <FilmPage />;
}
