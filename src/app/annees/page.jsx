import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

// Configuration ISR
export const revalidate = 3600;

// Metadata statique
export const metadata = {
  title: 'Films par année de sortie | MovieHunt',
  description: 'Explorez les films par année de sortie : 2025, 2024, 2023 et plus. Trouvez les meilleurs films de chaque année avec notes et critiques.',
  keywords: ['films par année', 'sorties cinéma', 'films 2025', 'films 2024', 'nouveautés cinéma'],
  alternates: {
    canonical: 'https://www.moviehunt.fr/annees',
  },
  openGraph: {
    title: 'Films par année de sortie | MovieHunt',
    description: 'Explorez les films par année de sortie et découvrez les meilleurs films de chaque année.',
    type: 'website',
    url: 'https://www.moviehunt.fr/annees',
    siteName: 'MovieHunt',
    locale: 'fr_FR',
  },
};

// Récupérer le nombre de films par année
const getYearCounts = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
    const counts = {};

    for (const year of years) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      const { count } = await supabase
        .from('films')
        .select('*', { count: 'exact', head: true })
        .gte('release_date', startDate)
        .lte('release_date', endDate);
      
      if (count && count > 0) {
        counts[year] = count;
      }
    }

    return counts;
  },
  ['year-counts'],
  { revalidate: 3600, tags: ['years'] }
);

export default async function YearsPage() {
  const counts = await getYearCounts();
  const sortedYears = Object.keys(counts).sort((a, b) => b - a);

  // Fil d'Ariane
  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Par année' }
  ];

  // Schema JSON-LD
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Films par année',
    description: 'Tous les films classés par année de sortie',
    url: 'https://www.moviehunt.fr/annees',
    hasPart: sortedYears.slice(0, 10).map(year => ({
      '@type': 'CollectionPage',
      name: `Films ${year}`,
      url: `https://www.moviehunt.fr/annee/${year}`,
    })),
  };

  // Grouper par décennie
  const decades = {};
  sortedYears.forEach(year => {
    const decade = Math.floor(year / 10) * 10;
    if (!decades[decade]) decades[decade] = [];
    decades[decade].push(year);
  });

  return (
    <div className="container mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Films par année
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explorez notre catalogue par année de sortie et découvrez les meilleurs films de chaque période.
        </p>
      </header>

      {/* Années récentes en grand */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Années récentes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedYears.slice(0, 10).map((year) => (
            <Link
              key={year}
              href={`/annee/${year}`}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="text-3xl font-bold block">{year}</span>
              <span className="text-sm opacity-90">{counts[year]} films</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Années par décennie */}
      {Object.keys(decades).sort((a, b) => b - a).map(decade => (
        <section key={decade} className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Années {decade}</h2>
          <div className="flex flex-wrap gap-3">
            {decades[decade].map(year => (
              <Link
                key={year}
                href={`/annee/${year}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors shadow-sm"
              >
                <span className="font-semibold">{year}</span>
                <span className="text-gray-500 text-sm ml-2">({counts[year]})</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Section SEO avec liens internes */}
      <section className="mt-12 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">
          Autres façons d'explorer
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/genres" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Par genre</h3>
            <p className="text-sm text-gray-600">Action, Comédie, Drame, Horreur...</p>
          </Link>
          <Link href="/top-rated" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Les mieux notés</h3>
            <p className="text-sm text-gray-600">Notre sélection des meilleurs films</p>
          </Link>
          <Link href="/films-inconnus" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Pépites méconnues</h3>
            <p className="text-sm text-gray-600">Des films à découvrir absolument</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
