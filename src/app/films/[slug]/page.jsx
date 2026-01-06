import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import FilmPageContent from '@/components/films/FilmPageContent';

// Configuration ISR - pages statiques régénérées toutes les heures
export const revalidate = 3600;

// Fonction pour récupérer le film côté serveur avec cache
const getFilm = unstable_cache(
  async (slug) => {
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
    
    // Récupérer le staff remarquable en même temps
    if (film) {
      const { data: staffData } = await supabase
        .from('remarkable_staff')
        .select('*')
        .eq('film_id', film.id);
      
      film.remarkable_staff = staffData || [];
    }
    
    return film;
  },
  ['film-by-slug'],
  { revalidate: 3600, tags: ['films'] }
);

// Générer les métadonnées dynamiques (MULTILINGUAL DISABLED - French only)
export async function generateMetadata({ params }) {
  const film = await getFilm(params.slug);
  
  if (!film) {
    return {
      title: 'Film non trouvé | MovieHunt',
    };
  }

  const title = film.title;
  const synopsis = film.synopsis || '';
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
  const yearText = releaseYear ? ` (${releaseYear})` : '';
  
  const rating = film.note_sur_10 ? `Note: ${film.note_sur_10}/10. ` : '';
  const suffixText = ' Critique complète & streaming.';
  const maxSynopsisLength = 155 - rating.length - suffixText.length;
  const synopsisShort = synopsis 
    ? synopsis.substring(0, Math.max(50, maxSynopsisLength)) + '...' 
    : '';
  
  const metaTitle = `${title}${yearText} - Critique et avis | MovieHunt`;
  const metaDescription = `${rating}${synopsisShort}${suffixText}`;
  
  const imageUrl = film.poster_path 
    ? (film.poster_path.startsWith('/') 
        ? `https://image.tmdb.org/t/p/w780${film.poster_path}` 
        : film.poster_path)
    : 'https://www.moviehunt.fr/images/og-image.jpg';
  
  const canonicalUrl = `https://www.moviehunt.fr/films/${params.slug}`;
  
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
      locale: 'fr_FR',
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 780,
          height: 1170,
          alt: `Affiche du film ${title}`,
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

// Pré-générer les pages des films les plus populaires au build
export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  // Récupérer les slugs des films (limité aux 100 plus récents pour le build initial)
  const { data: films } = await supabase
    .from('films')
    .select('slug')
    .order('date_ajout', { ascending: false })
    .limit(100);
  
  return (films || [])
    .filter(film => film.slug)
    .map(film => ({ slug: film.slug }));
}

export default async function FilmPage({ params }) {
  const film = await getFilm(params.slug);
  
  if (!film) {
    notFound();
  }
  
  return <FilmPageContent film={film} />;
}
