import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

// Configurations des pages Top
const TOP_CONFIGS = {
  '10-films-action': { limit: 10, genre: 'Action', title: 'Top 10 films Action' },
  '10-films-comedie': { limit: 10, genre: 'Comédie', title: 'Top 10 Comédies' },
  '10-films-horreur': { limit: 10, genre: 'Horreur', title: 'Top 10 films Horreur' },
  '10-films-thriller': { limit: 10, genre: 'Thriller', title: 'Top 10 Thrillers' },
  '10-films-drame': { limit: 10, genre: 'Drame', title: 'Top 10 Drames' },
  '10-films-science-fiction': { limit: 10, genre: 'Science-Fiction', title: 'Top 10 Science-Fiction' },
  '20-meilleurs-films': { limit: 20, genre: null, title: 'Top 20 meilleurs films' },
  '50-meilleurs-films': { limit: 50, genre: null, title: 'Top 50 meilleurs films' },
  '10-films-animation': { limit: 10, genre: 'Animation', title: 'Top 10 films Animation' },
  '10-films-romance': { limit: 10, genre: 'Romance', title: 'Top 10 films Romance' },
};

const getTopFilms = unstable_cache(
  async (limit, genre) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    let query = supabase
      .from('films')
      .select('*')
      .order('note_sur_10', { ascending: false })
      .limit(limit);

    if (genre) {
      query = query.ilike('genres', `%${genre}%`);
    }

    const { data: films, error } = await query;
    if (error) return [];
    return films || [];
  },
  ['top-films'],
  { revalidate: 3600, tags: ['top'] }
);

export async function generateStaticParams() {
  return Object.keys(TOP_CONFIGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const config = TOP_CONFIGS[params.slug];
  if (!config) return { title: 'Page non trouvée | MovieHunt' };

  const genreText = config.genre ? ` ${config.genre.toLowerCase()}` : '';

  return {
    title: `${config.title} - Les meilleurs films${genreText} | MovieHunt`,
    description: `Découvrez notre ${config.title.toLowerCase()} avec notes et critiques détaillées. Sélection des meilleurs films${genreText} par MovieHunt.`,
    keywords: [config.title.toLowerCase(), `meilleurs films${genreText}`, 'top films', 'classement'],
    alternates: { canonical: `https://www.moviehunt.fr/top/${params.slug}` },
    openGraph: {
      title: `${config.title} | MovieHunt`,
      description: `Les meilleurs films${genreText} sélectionnés par MovieHunt`,
    },
  };
}

export default async function TopPage({ params }) {
  const config = TOP_CONFIGS[params.slug];
  if (!config) notFound();

  const films = await getTopFilms(config.limit, config.genre);

  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Classements', href: '/classements' },
    { name: config.title }
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.title,
    numberOfItems: films.length,
    itemListElement: films.map((film, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: film.title,
        url: `https://www.moviehunt.fr/films/${film.slug || film.id}`,
      },
    })),
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">{config.title}</h1>
        <p className="text-xl text-gray-600">
          {config.genre 
            ? `Les ${config.limit} meilleurs films ${config.genre.toLowerCase()} selon MovieHunt`
            : `Les ${config.limit} meilleurs films tous genres confondus`
          }
        </p>
      </header>

      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Autres classements</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TOP_CONFIGS)
            .filter(([slug]) => slug !== params.slug)
            .slice(0, 6)
            .map(([slug, cfg]) => (
              <Link key={slug} href={`/top/${slug}`}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-indigo-50 transition-colors">
                {cfg.title}
              </Link>
            ))}
        </div>
      </nav>

      {/* Liste numérotée des films */}
      <div className="space-y-4">
        {films.map((film, index) => (
          <Link
            key={film.id}
            href={`/films/${film.slug || film.id}`}
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <span className="text-3xl font-bold text-indigo-600 w-12 text-center">
              {index + 1}
            </span>
            <img
              src={film.poster_url || '/images/placeholder.jpg'}
              alt={film.title}
              className="w-16 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{film.title}</h2>
              <p className="text-sm text-gray-500">
                {film.release_date && new Date(film.release_date).getFullYear()}
                {film.genres && ` • ${film.genres.split(',')[0]}`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-yellow-500">{film.note_sur_10}</span>
              <span className="text-gray-400">/10</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
