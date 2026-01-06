import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FilmGrid from '@/components/films/FilmGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

// Configuration ISR - pages régénérées toutes les heures
export const revalidate = 3600;

// Mapping des genres avec leurs slugs SEO-friendly
const GENRES = {
  'action': { name: 'Action', description: 'Films d\'action avec des scènes spectaculaires, poursuites et combats.' },
  'aventure': { name: 'Aventure', description: 'Films d\'aventure épiques avec exploration et découvertes.' },
  'animation': { name: 'Animation', description: 'Films d\'animation pour tous les âges.' },
  'comedie': { name: 'Comédie', description: 'Comédies hilarantes pour passer un bon moment.' },
  'crime': { name: 'Crime', description: 'Films policiers et thrillers criminels.' },
  'documentaire': { name: 'Documentaire', description: 'Documentaires captivants sur des sujets variés.' },
  'drame': { name: 'Drame', description: 'Drames émouvants avec des histoires profondes.' },
  'famille': { name: 'Famille', description: 'Films familiaux à regarder ensemble.' },
  'fantastique': { name: 'Fantastique', description: 'Films fantastiques avec magie et créatures.' },
  'histoire': { name: 'Histoire', description: 'Films historiques basés sur des événements réels.' },
  'horreur': { name: 'Horreur', description: 'Films d\'horreur terrifiants et angoissants.' },
  'musique': { name: 'Musique', description: 'Films musicaux et comédies musicales.' },
  'mystere': { name: 'Mystère', description: 'Films à suspense avec des énigmes à résoudre.' },
  'romance': { name: 'Romance', description: 'Films romantiques et histoires d\'amour.' },
  'science-fiction': { name: 'Science-Fiction', description: 'Films de science-fiction futuristes.' },
  'thriller': { name: 'Thriller', description: 'Thrillers haletants qui tiennent en haleine.' },
  'guerre': { name: 'Guerre', description: 'Films de guerre et conflits historiques.' },
  'western': { name: 'Western', description: 'Westerns classiques et modernes.' },
};

// Récupérer les films par genre avec cache
const getFilmsByGenre = unstable_cache(
  async (genreName) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .ilike('genres', `%${genreName}%`)
      .order('note_sur_10', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Erreur getFilmsByGenre:', error);
      return [];
    }

    return films || [];
  },
  ['films-by-genre'],
  { revalidate: 3600, tags: ['genres'] }
);

// Générer les paramètres statiques pour tous les genres
export async function generateStaticParams() {
  return Object.keys(GENRES).map((slug) => ({ slug }));
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }) {
  const genre = GENRES[params.slug];
  
  if (!genre) {
    return { title: 'Genre non trouvé | MovieHunt' };
  }

  const films = await getFilmsByGenre(genre.name);
  const count = films.length;

  return {
    title: `Films ${genre.name} : ${count} films à voir | MovieHunt`,
    description: `${genre.description} Découvrez notre sélection de ${count} films ${genre.name.toLowerCase()} avec notes et critiques détaillées.`,
    keywords: [`films ${genre.name.toLowerCase()}`, `meilleurs films ${genre.name.toLowerCase()}`, `${genre.name.toLowerCase()} à voir`, 'recommandation film'],
    alternates: {
      canonical: `https://www.moviehunt.fr/genre/${params.slug}`,
    },
    openGraph: {
      title: `Films ${genre.name} : ${count} films à voir`,
      description: genre.description,
      type: 'website',
      url: `https://www.moviehunt.fr/genre/${params.slug}`,
      siteName: 'MovieHunt',
      locale: 'fr_FR',
    },
  };
}

export default async function GenrePage({ params }) {
  const genre = GENRES[params.slug];

  if (!genre) {
    notFound();
  }

  const films = await getFilmsByGenre(genre.name);

  // Fil d'Ariane
  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Genres', href: '/genres' },
    { name: genre.name }
  ];

  // Schema JSON-LD pour la page de collection
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Films ${genre.name}`,
    description: genre.description,
    url: `https://www.moviehunt.fr/genre/${params.slug}`,
    numberOfItems: films.length,
    hasPart: films.slice(0, 10).map(film => ({
      '@type': 'Movie',
      name: film.title,
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
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Films {genre.name}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {genre.description}
        </p>
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
            {films.length} films
          </span>
        </div>
      </header>

      {/* Liens vers autres genres (maillage interne) */}
      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Autres genres</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(GENRES)
            .filter(([slug]) => slug !== params.slug)
            .slice(0, 8)
            .map(([slug, g]) => (
              <Link
                key={slug}
                href={`/genre/${slug}`}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
              >
                {g.name}
              </Link>
            ))}
          <Link
            href="/genres"
            className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors"
          >
            Tous les genres →
          </Link>
        </div>
      </nav>

      {films.length > 0 ? (
        <FilmGrid films={films} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun film trouvé dans ce genre.</p>
        </div>
      )}

      {/* Section SEO avec liens internes */}
      <section className="mt-12 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">
          Découvrez plus de films
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/top-rated" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Films les mieux notés</h3>
            <p className="text-sm text-gray-600">Notre sélection des meilleurs films</p>
          </Link>
          <Link href="/films-inconnus" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Pépites méconnues</h3>
            <p className="text-sm text-gray-600">Des films à découvrir absolument</p>
          </Link>
          <Link href="/quel-film-regarder" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800">Quel film regarder ?</h3>
            <p className="text-sm text-gray-600">Guide pour choisir votre film</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
