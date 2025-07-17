import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.fr';

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  // Créer un client Supabase côté serveur
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // Récupérer les films publiés (adapter la requête si besoin)
  const { data: films, error } = await supabase
    .from('films')
    .select('id, slug, title, synopsis, date_ajout, poster_url, poster_path')
    .order('date_ajout', { ascending: false })
    .limit(30); // Limite à 30 films récents

  if (error) {
    return new NextResponse('Erreur lors de la récupération des films', { status: 500 });
  }

  const items = films
    .map(film => {
      // Détermination de l'URL de l'image principale
      let imageUrl = '';
      if (film.poster_url) {
        imageUrl = film.poster_url.startsWith('http') ? film.poster_url : `${SITE_URL}${film.poster_url}`;
      } else if (film.poster_path) {
        imageUrl = film.poster_path.startsWith('http')
          ? film.poster_path
          : `https://image.tmdb.org/t/p/w500${film.poster_path}`;
      }
      // Extraction du nom de fichier
      let imageName = '';
      if (imageUrl) {
        const parts = imageUrl.split('/');
        imageName = parts[parts.length - 1];
      }
      return `    <item>
      <title>${escapeXml(film.title)}</title>
      <link>${SITE_URL}/film/${film.slug}</link>
      <guid>${SITE_URL}/film/${film.slug}</guid>
      <pubDate>${new Date(film.date_ajout).toUTCString()}</pubDate>
      <description>${film.synopsis ? escapeXml(film.synopsis) : ''}</description>
      ${imageUrl ? `<image>\n        <name>${escapeXml(imageName)}</name>\n        <url>${escapeXml(imageUrl)}</url>\n      </image>` : ''}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MovieHunt – Nouveaux films</title>
    <link>${SITE_URL}</link>
    <description>Les derniers films publiés sur MovieHunt</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
    },
  });
}
