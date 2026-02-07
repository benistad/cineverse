import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FilmGrid from '@/components/films/FilmGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

// Configurations des ambiances/moods
const MOODS = {
  'soiree-couple': {
    title: 'Films pour une soirée en couple',
    description: 'Sélection de films romantiques et émouvants parfaits pour une soirée à deux.',
    genres: ['Romance', 'Drame', 'Comédie'],
    minRating: 6,
    icon: '💕'
  },
  'feel-good': {
    title: 'Films feel-good',
    description: 'Des films qui remontent le moral et font du bien.',
    genres: ['Comédie', 'Animation', 'Famille'],
    minRating: 7,
    icon: '😊'
  },
  'frissons': {
    title: 'Films à frissons',
    description: 'Pour ceux qui aiment avoir peur ou frissonner.',
    genres: ['Horreur', 'Thriller'],
    minRating: 6,
    icon: '😱'
  },
  'action-intense': {
    title: 'Films d\'action intense',
    description: 'Adrénaline et scènes spectaculaires garanties.',
    genres: ['Action', 'Aventure'],
    minRating: 6.5,
    icon: '💥'
  },
  'reflexion': {
    title: 'Films qui font réfléchir',
    description: 'Des films profonds qui marquent les esprits.',
    genres: ['Drame', 'Science-Fiction'],
    minRating: 7.5,
    icon: '🧠'
  },
  'rire': {
    title: 'Films pour rire',
    description: 'Comédies hilarantes pour passer un bon moment.',
    genres: ['Comédie'],
    minRating: 6,
    icon: '😂'
  },
  'famille': {
    title: 'Films en famille',
    description: 'Films adaptés à toute la famille.',
    genres: ['Animation', 'Famille', 'Aventure'],
    minRating: 6,
    icon: '👨‍👩‍👧‍👦'
  },
  'suspense': {
    title: 'Films à suspense',
    description: 'Des intrigues captivantes qui tiennent en haleine.',
    genres: ['Thriller', 'Mystère', 'Crime'],
    minRating: 7,
    icon: '🔍'
  },
};

const getFilmsByMood = unstable_cache(
  async (genres, minRating) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Construire la requête pour plusieurs genres
    let query = supabase
      .from('films')
      .select('*')
      .gte('note_sur_10', minRating)
      .order('note_sur_10', { ascending: false })
      .limit(50);

    // Filtrer par genres (OR)
    const genreFilters = genres.map(g => `genres.ilike.%${g}%`).join(',');
    query = query.or(genreFilters);

    const { data: films, error } = await query;
    if (error) return [];
    return films || [];
  },
  ['films-by-mood'],
  { revalidate: 3600, tags: ['moods'] }
);

export async function generateStaticParams() {
  return Object.keys(MOODS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const mood = MOODS[params.slug];
  if (!mood) return { title: 'Page non trouvée' };

  const films = await getFilmsByMood(mood.genres, mood.minRating);

  return {
    title: `${mood.title} : ${films.length} films`,
    description: `${mood.description} ${films.length} films sélectionnés par MovieHunt.`,
    keywords: [mood.title.toLowerCase(), 'film ce soir', 'idée film', 'quel film regarder'],
    alternates: { canonical: `https://www.moviehunt.fr/ambiance/${params.slug}` },
    openGraph: {
      title: `${mood.title} | MovieHunt`,
      description: mood.description,
    },
  };
}

export default async function MoodPage({ params }) {
  const mood = MOODS[params.slug];
  if (!mood) notFound();

  const films = await getFilmsByMood(mood.genres, mood.minRating);

  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Par ambiance', href: '/ambiances' },
    { name: mood.title }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{mood.icon}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800">{mood.title}</h1>
        </div>
        <p className="text-xl text-gray-600 mb-4">{mood.description}</p>
        <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
          {films.length} films
        </span>
      </header>

      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Autres ambiances</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MOODS)
            .filter(([slug]) => slug !== params.slug)
            .map(([slug, m]) => (
              <Link key={slug} href={`/ambiance/${slug}`}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-indigo-50 transition-colors">
                {m.icon} {m.title.replace('Films ', '').replace("Films d'", '')}
              </Link>
            ))}
        </div>
      </nav>

      {films.length > 0 ? <FilmGrid films={films} /> : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun film trouvé pour cette ambiance.</p>
        </div>
      )}
    </div>
  );
}
