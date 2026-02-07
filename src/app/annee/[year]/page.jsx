import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FilmGrid from '@/components/films/FilmGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

// Configuration ISR
export const revalidate = 3600;

// Années valides (de 1990 à l'année courante + 1)
const currentYear = new Date().getFullYear();
const VALID_YEARS = Array.from({ length: currentYear - 1989 + 1 }, (_, i) => 1990 + i);

// Récupérer les films par année avec cache
const getFilmsByYear = unstable_cache(
  async (year) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .gte('release_date', startDate)
      .lte('release_date', endDate)
      .order('note_sur_10', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Erreur getFilmsByYear:', error);
      return [];
    }

    return films || [];
  },
  ['films-by-year'],
  { revalidate: 3600, tags: ['years'] }
);

// Générer les paramètres statiques pour les 10 dernières années
export async function generateStaticParams() {
  const recentYears = VALID_YEARS.slice(-10);
  return recentYears.map((year) => ({ year: year.toString() }));
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }) {
  const year = parseInt(params.year);
  
  if (!VALID_YEARS.includes(year)) {
    return { title: 'Année non trouvée' };
  }

  const films = await getFilmsByYear(year);
  const count = films.length;

  return {
    title: `Films ${year} : ${count} films à voir`,
    description: `Découvrez les meilleurs films de ${year} avec notes et critiques détaillées. ${count} films sélectionnés par MovieHunt.`,
    keywords: [`films ${year}`, `meilleurs films ${year}`, `sorties ${year}`, 'cinéma'],
    alternates: {
      canonical: `https://www.moviehunt.fr/annee/${year}`,
    },
    openGraph: {
      title: `Films ${year} : ${count} films à voir`,
      description: `Découvrez les meilleurs films de ${year} avec notes et critiques.`,
      type: 'website',
      url: `https://www.moviehunt.fr/annee/${year}`,
      siteName: 'MovieHunt',
      locale: 'fr_FR',
    },
  };
}

export default async function YearPage({ params }) {
  const year = parseInt(params.year);

  if (!VALID_YEARS.includes(year)) {
    notFound();
  }

  const films = await getFilmsByYear(year);

  // Fil d'Ariane
  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Par année', href: '/annees' },
    { name: year.toString() }
  ];

  // Années adjacentes pour navigation
  const prevYear = year > 1990 ? year - 1 : null;
  const nextYear = year < currentYear ? year + 1 : null;

  // Schema JSON-LD
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Films ${year}`,
    description: `Les meilleurs films sortis en ${year}`,
    url: `https://www.moviehunt.fr/annee/${year}`,
    numberOfItems: films.length,
    hasPart: films.slice(0, 10).map(film => ({
      '@type': 'Movie',
      name: film.title,
      datePublished: film.release_date,
      url: `https://www.moviehunt.fr/films/${film.slug || film.id}`,
    })),
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-2">
              Films {year}
            </h1>
            <p className="text-xl text-gray-600">
              {films.length} films notés par MovieHunt
            </p>
          </div>
          
          {/* Navigation entre années */}
          <div className="flex items-center gap-2">
            {prevYear && (
              <Link
                href={`/annee/${prevYear}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                ← {prevYear}
              </Link>
            )}
            {nextYear && (
              <Link
                href={`/annee/${nextYear}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                {nextYear} →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Navigation rapide par décennie */}
      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Autres années</h2>
        <div className="flex flex-wrap gap-2">
          {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]
            .filter(y => y !== year)
            .map(y => (
              <Link
                key={y}
                href={`/annee/${y}`}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
              >
                {y}
              </Link>
            ))}
          <Link
            href="/annees"
            className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors"
          >
            Toutes les années →
          </Link>
        </div>
      </nav>

      {films.length > 0 ? (
        <FilmGrid films={films} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun film trouvé pour cette année.</p>
          <Link href="/annees" className="text-indigo-600 hover:underline mt-2 inline-block">
            Voir toutes les années
          </Link>
        </div>
      )}

      {/* Section SEO avec liens internes */}
      <section className="mt-12 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">
          Explorer par genre
        </h2>
        <div className="flex flex-wrap gap-2">
          {['action', 'comedie', 'drame', 'horreur', 'thriller', 'science-fiction'].map(genre => (
            <Link
              key={genre}
              href={`/genre/${genre}`}
              className="px-4 py-2 bg-white rounded-full text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm"
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1).replace('-', ' ')}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
