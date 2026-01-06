import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FilmGrid from '@/components/films/FilmGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

const GENRES = {
  'action': 'Action', 'comedie': 'Comédie', 'drame': 'Drame', 'horreur': 'Horreur',
  'thriller': 'Thriller', 'science-fiction': 'Science-Fiction', 'aventure': 'Aventure',
  'animation': 'Animation', 'romance': 'Romance', 'fantastique': 'Fantastique',
};

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

const getFilmsByGenreAndYear = unstable_cache(
  async (genreName, year) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .ilike('genres', `%${genreName}%`)
      .gte('release_date', `${year}-01-01`)
      .lte('release_date', `${year}-12-31`)
      .order('note_sur_10', { ascending: false })
      .limit(50);

    if (error) return [];
    return films || [];
  },
  ['films-genre-year'],
  { revalidate: 3600, tags: ['genre-year'] }
);

export async function generateStaticParams() {
  const params = [];
  for (const genreSlug of Object.keys(GENRES)) {
    for (const year of YEARS) {
      params.push({ slug: `${genreSlug}-${year}` });
    }
  }
  return params;
}

function parseSlug(slug) {
  for (const [genreSlug, genreName] of Object.entries(GENRES)) {
    for (const year of YEARS) {
      if (slug === `${genreSlug}-${year}`) {
        return { genreSlug, genreName, year };
      }
    }
  }
  return null;
}

export async function generateMetadata({ params }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { title: 'Page non trouvée | MovieHunt' };

  const { genreName, year } = parsed;
  const films = await getFilmsByGenreAndYear(genreName, year);

  return {
    title: `Films ${genreName} ${year} : ${films.length} films à voir | MovieHunt`,
    description: `Découvrez les meilleurs films ${genreName.toLowerCase()} de ${year}. ${films.length} films sélectionnés avec notes et critiques.`,
    keywords: [`films ${genreName.toLowerCase()} ${year}`, `meilleurs ${genreName.toLowerCase()} ${year}`],
    alternates: { canonical: `https://www.moviehunt.fr/films-genre-annee/${params.slug}` },
    openGraph: {
      title: `Films ${genreName} ${year} | MovieHunt`,
      description: `Les meilleurs films ${genreName.toLowerCase()} de ${year}`,
      type: 'website',
    },
  };
}

export default async function GenreYearPage({ params }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) notFound();

  const { genreSlug, genreName, year } = parsed;
  const films = await getFilmsByGenreAndYear(genreName, year);

  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: genreName, href: `/genre/${genreSlug}` },
    { name: year.toString() }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Films {genreName} {year}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Les meilleurs films {genreName.toLowerCase()} sortis en {year}
        </p>
        <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
          {films.length} films
        </span>
      </header>

      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">{genreName} par année</h2>
        <div className="flex flex-wrap gap-2">
          {YEARS.filter(y => y !== year).map(y => (
            <Link key={y} href={`/films-genre-annee/${genreSlug}-${y}`}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-indigo-50 transition-colors">
              {y}
            </Link>
          ))}
        </div>
      </nav>

      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Autres genres en {year}</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(GENRES).filter(([s]) => s !== genreSlug).slice(0, 6).map(([s, n]) => (
            <Link key={s} href={`/films-genre-annee/${s}-${year}`}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-indigo-50 transition-colors">
              {n}
            </Link>
          ))}
        </div>
      </nav>

      {films.length > 0 ? <FilmGrid films={films} /> : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun film {genreName.toLowerCase()} trouvé pour {year}.</p>
          <Link href={`/genre/${genreSlug}`} className="text-indigo-600 hover:underline mt-2 inline-block">
            Voir tous les films {genreName}
          </Link>
        </div>
      )}
    </div>
  );
}
