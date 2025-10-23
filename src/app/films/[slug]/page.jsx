import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import FilmPageContent from '@/components/films/FilmPageContent';

// Configuration pour le revalidation (ISR)
export const revalidate = 3600; // Revalider toutes les heures
export const dynamic = 'force-dynamic'; // Forcer le rendu dynamique

// Fonction pour récupérer le film côté serveur
async function getFilm(slug) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  // Rechercher le film par son slug
  const { data, error } = await supabase
    .from('films')
    .select('*')
    .eq('slug', slug)
    .single();
  
  let film = null;
  
  if (error || !data) {
    // Si le slug n'existe pas, essayer de trouver le film par son titre
    const normalizedSlug = slug.replace(/-/g, ' ').toLowerCase();
    
    const { data: filmByTitle, error: titleError } = await supabase
      .from('films')
      .select('*')
      .ilike('title', `%${normalizedSlug}%`)
      .order('date_ajout', { ascending: false })
      .limit(1);
    
    if (titleError || !filmByTitle || filmByTitle.length === 0) {
      return null;
    }
    
    film = filmByTitle[0];
  } else {
    film = data;
  }
  
  return film;
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }) {
  const film = await getFilm(params.slug);
  
  if (!film) {
    return {
      title: 'Film non trouvé | MovieHunt',
    };
  }

  // Détecter la locale depuis les cookies
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const locale = localeCookie?.value || 'fr';
  
  // Récupérer la traduction si locale = EN
  let translation = null;
  if (locale === 'en') {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data } = await supabase
      .from('film_translations')
      .select('*')
      .eq('film_id', film.id)
      .eq('locale', 'en')
      .single();
    
    translation = data;
  }

  // Utiliser la traduction si disponible
  const title = translation?.title || film.title;
  const synopsis = translation?.synopsis || film.synopsis || '';
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
  const yearText = releaseYear ? ` (${releaseYear})` : '';
  
  // Textes selon la locale
  const isEnglish = locale === 'en';
  const ratingLabel = isEnglish ? 'Rating' : 'Note';
  const rating = film.note_sur_10 ? `${ratingLabel}: ${film.note_sur_10}/10. ` : '';
  
  // Calculer la longueur maximale pour le synopsis (max 155 caractères total)
  const suffixText = isEnglish 
    ? ' Complete review & streaming.' 
    : ' Critique complète & streaming.';
  const maxSynopsisLength = 155 - rating.length - suffixText.length;
  const synopsisShort = synopsis 
    ? synopsis.substring(0, Math.max(50, maxSynopsisLength)) + '...' 
    : '';
  
  const metaTitle = isEnglish 
    ? `${title}${yearText} - Review and Rating | MovieHunt`
    : `${title}${yearText} - Critique et avis | MovieHunt`;
  const metaDescription = isEnglish
    ? `${rating}${synopsisShort}${suffixText}`
    : `${rating}${synopsisShort}${suffixText}`;
  
  const imageUrl = film.poster_path 
    ? (film.poster_path.startsWith('/') 
        ? `https://image.tmdb.org/t/p/w780${film.poster_path}` 
        : film.poster_path)
    : 'https://www.moviehunt.fr/images/og-image.jpg';
  
  const imageAlt = isEnglish ? `${title} poster` : `Affiche du film ${title}`;
  const ogLocale = isEnglish ? 'en_US' : 'fr_FR';
  const canonicalUrl = isEnglish 
    ? `https://www.moviehunt.fr/en/films/${params.slug}`
    : `https://www.moviehunt.fr/films/${params.slug}`;
  
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
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
      locale: ogLocale,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 780,
          height: 1170,
          alt: imageAlt,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@MovieHunt',
      creator: '@MovieHunt',
      title: `${film.title}${yearText} | MovieHunt`,
      description: `${rating}${synopsis}`,
      images: [imageUrl],
    },
  };
}

export default async function FilmPage({ params }) {
  const film = await getFilm(params.slug);
  
  if (!film) {
    notFound();
  }
  
  return <FilmPageContent film={film} />;
}
