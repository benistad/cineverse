import { cookies } from 'next/headers';
import FilmPage from '@/app/films/[slug]/page';

/**
 * Page anglaise pour les films
 * Affiche le même contenu que la page française mais avec locale EN
 */
export default async function EnglishFilmPage({ params }) {
  // Définir la locale EN dans les cookies
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', 'en', {
    path: '/',
    maxAge: 365 * 24 * 60 * 60, // 1 an
  });

  // Afficher la même page que la version française
  // Le contenu sera en anglais grâce au cookie NEXT_LOCALE=en
  return <FilmPage params={params} />;
}

// Générer les métadonnées pour le SEO
export async function generateMetadata({ params }) {
  // Import dynamique pour éviter les problèmes de dépendances circulaires
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Récupérer le film
  const { data: film } = await supabase
    .from('films')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!film) {
    return {
      title: 'Film not found | MovieHunt',
    };
  }

  // Récupérer la traduction anglaise
  const { data: translation } = await supabase
    .from('film_translations')
    .select('*')
    .eq('film_id', film.id)
    .eq('locale', 'en')
    .single();

  const title = translation?.title || film.title;
  const synopsis = translation?.synopsis || film.synopsis || '';
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
  const yearText = releaseYear ? ` (${releaseYear})` : '';
  const synopsisShort = synopsis ? synopsis.substring(0, 150) + '...' : '';
  const rating = film.note_sur_10 ? `Rating: ${film.note_sur_10}/10. ` : '';
  
  const imageUrl = film.poster_path 
    ? (film.poster_path.startsWith('/') 
        ? `https://image.tmdb.org/t/p/w780${film.poster_path}` 
        : film.poster_path)
    : 'https://www.moviehunt.fr/images/og-image.jpg';
  
  return {
    title: `${title}${yearText} - Review and Rating | MovieHunt`,
    description: `${rating}${synopsisShort} Discover our complete review, cast and where to watch ${title} streaming.`,
    alternates: {
      canonical: `https://www.moviehunt.fr/en/films/${params.slug}`,
      languages: {
        'fr': `https://www.moviehunt.fr/films/${params.slug}`,
        'en': `https://www.moviehunt.fr/en/films/${params.slug}`,
        'x-default': `https://www.moviehunt.fr/films/${params.slug}`
      }
    },
    openGraph: {
      title: `${title}${yearText} | MovieHunt`,
      description: `${rating}${synopsisShort}`,
      type: 'video.movie',
      siteName: 'MovieHunt',
      locale: 'en_US',
      url: `https://www.moviehunt.fr/en/films/${params.slug}`,
      images: [
        {
          url: imageUrl,
          width: 780,
          height: 1170,
          alt: `${title} poster`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title}${yearText} | MovieHunt`,
      description: `${rating}${synopsisShort}`,
      images: [imageUrl],
    }
  };
}
