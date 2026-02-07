import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

// Configuration ISR
export const revalidate = 3600;

// Metadata statique
export const metadata = {
  title: 'Tous les genres de films',
  description: 'Explorez tous les genres de films : Action, Comédie, Drame, Horreur, Science-Fiction, Thriller et plus. Trouvez le film parfait selon vos envies.',
  keywords: ['genres films', 'catégories films', 'films par genre', 'action', 'comédie', 'drame', 'horreur', 'thriller'],
  alternates: {
    canonical: 'https://www.moviehunt.fr/genres',
  },
  openGraph: {
    title: 'Tous les genres de films | MovieHunt',
    description: 'Explorez tous les genres de films et trouvez le film parfait selon vos envies.',
    type: 'website',
    url: 'https://www.moviehunt.fr/genres',
    siteName: 'MovieHunt',
    locale: 'fr_FR',
  },
};

// Genres avec icônes et couleurs
const GENRES = [
  { slug: 'action', name: 'Action', icon: '💥', color: 'from-red-500 to-orange-500' },
  { slug: 'aventure', name: 'Aventure', icon: '🗺️', color: 'from-green-500 to-teal-500' },
  { slug: 'animation', name: 'Animation', icon: '🎨', color: 'from-pink-500 to-purple-500' },
  { slug: 'comedie', name: 'Comédie', icon: '😂', color: 'from-yellow-400 to-orange-400' },
  { slug: 'crime', name: 'Crime', icon: '🔍', color: 'from-gray-600 to-gray-800' },
  { slug: 'documentaire', name: 'Documentaire', icon: '📹', color: 'from-blue-400 to-cyan-400' },
  { slug: 'drame', name: 'Drame', icon: '🎭', color: 'from-purple-500 to-indigo-500' },
  { slug: 'famille', name: 'Famille', icon: '👨‍👩‍👧‍👦', color: 'from-green-400 to-emerald-400' },
  { slug: 'fantastique', name: 'Fantastique', icon: '✨', color: 'from-violet-500 to-purple-600' },
  { slug: 'histoire', name: 'Histoire', icon: '📜', color: 'from-amber-600 to-yellow-600' },
  { slug: 'horreur', name: 'Horreur', icon: '👻', color: 'from-gray-800 to-red-900' },
  { slug: 'musique', name: 'Musique', icon: '🎵', color: 'from-pink-400 to-rose-500' },
  { slug: 'mystere', name: 'Mystère', icon: '🕵️', color: 'from-slate-600 to-slate-800' },
  { slug: 'romance', name: 'Romance', icon: '💕', color: 'from-rose-400 to-pink-500' },
  { slug: 'science-fiction', name: 'Science-Fiction', icon: '🚀', color: 'from-cyan-500 to-blue-600' },
  { slug: 'thriller', name: 'Thriller', icon: '😱', color: 'from-red-600 to-red-800' },
  { slug: 'guerre', name: 'Guerre', icon: '⚔️', color: 'from-stone-500 to-stone-700' },
  { slug: 'western', name: 'Western', icon: '🤠', color: 'from-amber-500 to-orange-600' },
];

// Récupérer le nombre de films par genre
const getGenreCounts = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const counts = {};
    
    for (const genre of GENRES) {
      const { count } = await supabase
        .from('films')
        .select('*', { count: 'exact', head: true })
        .ilike('genres', `%${genre.name}%`);
      
      counts[genre.slug] = count || 0;
    }

    return counts;
  },
  ['genre-counts'],
  { revalidate: 3600, tags: ['genres'] }
);

export default async function GenresPage() {
  const counts = await getGenreCounts();

  // Fil d'Ariane
  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Genres' }
  ];

  // Schema JSON-LD
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Genres de films',
    description: 'Tous les genres de films disponibles sur MovieHunt',
    url: 'https://www.moviehunt.fr/genres',
    hasPart: GENRES.map(genre => ({
      '@type': 'CollectionPage',
      name: `Films ${genre.name}`,
      url: `https://www.moviehunt.fr/genre/${genre.slug}`,
    })),
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Tous les genres de films
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explorez notre catalogue par genre et trouvez le film parfait selon vos envies du moment.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {GENRES.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${genre.slug}`}
            className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
            <div className="relative p-6 text-white">
              <span className="text-4xl mb-3 block">{genre.icon}</span>
              <h2 className="text-xl font-bold mb-1">{genre.name}</h2>
              <p className="text-sm opacity-90">
                {counts[genre.slug] || 0} films
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Section SEO avec liens internes */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Autres façons de découvrir des films
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/top-rated"
            className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
          >
            Films les mieux notés
          </Link>
          <Link
            href="/films-inconnus"
            className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Pépites méconnues
          </Link>
          <Link
            href="/quel-film-regarder"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-colors"
          >
            Quel film regarder ?
          </Link>
        </div>
      </section>
    </div>
  );
}
