import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FilmGrid from '@/components/films/FilmGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

// Configurations des pages par note
const RATING_CONFIGS = {
  'notes-9-10': { min: 9, max: 10, title: 'Films exceptionnels', description: 'Les chefs-d\'œuvre notés 9/10 et plus' },
  'notes-8-10': { min: 8, max: 10, title: 'Excellents films', description: 'Films notés 8/10 et plus - à voir absolument' },
  'notes-7-10': { min: 7, max: 10, title: 'Très bons films', description: 'Films notés 7/10 et plus - recommandés' },
  'coups-de-coeur': { min: 8.5, max: 10, title: 'Coups de cœur', description: 'Nos coups de cœur - films marquants' },
};

const getFilmsByRating = unstable_cache(
  async (minRating, maxRating) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .gte('note_sur_10', minRating)
      .lte('note_sur_10', maxRating)
      .order('note_sur_10', { ascending: false })
      .limit(100);

    if (error) return [];
    return films || [];
  },
  ['films-by-rating'],
  { revalidate: 3600, tags: ['ratings'] }
);

export async function generateStaticParams() {
  return Object.keys(RATING_CONFIGS).map((rating) => ({ rating }));
}

export async function generateMetadata({ params }) {
  const config = RATING_CONFIGS[params.rating];
  if (!config) return { title: 'Page non trouvée | MovieHunt' };

  const films = await getFilmsByRating(config.min, config.max);

  return {
    title: `${config.title} : ${films.length} films notés ${config.min}+ | MovieHunt`,
    description: `${config.description}. Découvrez ${films.length} films exceptionnels sélectionnés par MovieHunt.`,
    keywords: ['meilleurs films', `films note ${config.min}`, 'films à voir', 'top films'],
    alternates: { canonical: `https://www.moviehunt.fr/meilleurs-films/${params.rating}` },
    openGraph: {
      title: `${config.title} | MovieHunt`,
      description: config.description,
      type: 'website',
      url: `https://www.moviehunt.fr/meilleurs-films/${params.rating}`,
    },
  };
}

export default async function RatingPage({ params }) {
  const config = RATING_CONFIGS[params.rating];
  if (!config) notFound();

  const films = await getFilmsByRating(config.min, config.max);

  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Meilleurs films', href: '/top-rated' },
    { name: config.title }
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.description,
    url: `https://www.moviehunt.fr/meilleurs-films/${params.rating}`,
    numberOfItems: films.length,
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">{config.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{config.description}</p>
        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
          {films.length} films notés {config.min}/10 et plus
        </span>
      </header>

      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Filtrer par note</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(RATING_CONFIGS)
            .filter(([slug]) => slug !== params.rating)
            .map(([slug, cfg]) => (
              <Link key={slug} href={`/meilleurs-films/${slug}`}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                {cfg.title}
              </Link>
            ))}
        </div>
      </nav>

      {films.length > 0 ? <FilmGrid films={films} /> : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun film trouvé avec cette note.</p>
        </div>
      )}
    </div>
  );
}
