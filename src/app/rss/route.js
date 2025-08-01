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
    .select('id, slug, title, synopsis, date_ajout, poster_url')
    .order('date_ajout', { ascending: false })
    .limit(30); // Limite à 30 films récents

  if (error) {
    console.error('Erreur Supabase lors de la récupération des films pour le RSS:', error);
    return new NextResponse('Erreur lors de la récupération des films', { status: 500 });
  }

  const items = films
    .map(film => {
      try {
      // Détermination de l'URL de l'image principale
      let imageUrl = '';
      if (film.poster_url && typeof film.poster_url === 'string') {
        imageUrl = film.poster_url.startsWith('http') ? film.poster_url : `${SITE_URL}${film.poster_url}`;
      } else {
        console.warn('Aucune image trouvée pour le film:', film.id, film.title, film.poster_url);
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
      } catch (err) {
        console.error('Erreur lors de la génération d\'un item RSS pour le film', film.id, film.title, err);
        return '';
      }
    })
    .join('\n');

  try {
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
  } catch (err) {
    console.error('Erreur lors de la génération globale du flux RSS:', err);
    return new NextResponse('Erreur lors de la génération du flux RSS', { status: 500 });
  }
}
