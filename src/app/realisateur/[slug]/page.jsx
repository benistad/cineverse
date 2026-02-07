import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FilmGrid from '@/components/films/FilmGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

// Générer un slug à partir du nom
function slugify(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Récupérer les réalisateurs populaires
const getPopularDirectors = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('remarkable_staff')
      .select('name, film_id')
      .eq('role', 'Réalisateur');

    if (error || !data) return [];

    // Compter les films par réalisateur
    const counts = {};
    data.forEach(d => {
      if (!counts[d.name]) counts[d.name] = 0;
      counts[d.name]++;
    });

    // Retourner les réalisateurs avec 2+ films
    return Object.entries(counts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([name, count]) => ({ name, slug: slugify(name), count }));
  },
  ['popular-directors'],
  { revalidate: 86400, tags: ['directors'] }
);

// Récupérer les films d'un réalisateur
const getFilmsByDirector = unstable_cache(
  async (directorName) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Récupérer les IDs des films
    const { data: staffData } = await supabase
      .from('remarkable_staff')
      .select('film_id')
      .eq('role', 'Réalisateur')
      .ilike('name', directorName);

    if (!staffData || staffData.length === 0) return { director: null, films: [] };

    const filmIds = staffData.map(s => s.film_id);

    const { data: films } = await supabase
      .from('films')
      .select('*')
      .in('id', filmIds)
      .order('release_date', { ascending: false });

    return { director: directorName, films: films || [] };
  },
  ['films-by-director'],
  { revalidate: 3600, tags: ['directors'] }
);

export async function generateStaticParams() {
  const directors = await getPopularDirectors();
  return directors.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const directors = await getPopularDirectors();
  const director = directors.find(d => d.slug === params.slug);
  
  if (!director) return { title: 'Réalisateur non trouvé' };

  const { films } = await getFilmsByDirector(director.name);

  return {
    title: `Films de ${director.name} : ${films.length} films`,
    description: `Découvrez tous les films de ${director.name} avec notes et critiques. Filmographie complète du réalisateur.`,
    keywords: [`films ${director.name}`, `filmographie ${director.name}`, 'réalisateur'],
    alternates: { canonical: `https://www.moviehunt.fr/realisateur/${params.slug}` },
    openGraph: {
      title: `Films de ${director.name} | MovieHunt`,
      description: `Filmographie de ${director.name} - ${films.length} films`,
      type: 'website',
    },
  };
}

export default async function DirectorPage({ params }) {
  const directors = await getPopularDirectors();
  const director = directors.find(d => d.slug === params.slug);
  
  if (!director) notFound();

  const { films } = await getFilmsByDirector(director.name);

  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Réalisateurs', href: '/realisateurs' },
    { name: director.name }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Films de {director.name}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Filmographie complète du réalisateur
        </p>
        <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
          {films.length} films
        </span>
      </header>

      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Autres réalisateurs</h2>
        <div className="flex flex-wrap gap-2">
          {directors.filter(d => d.slug !== params.slug).slice(0, 8).map(d => (
            <Link key={d.slug} href={`/realisateur/${d.slug}`}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-indigo-50 transition-colors">
              {d.name}
            </Link>
          ))}
          <Link href="/realisateurs"
            className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors">
            Tous →
          </Link>
        </div>
      </nav>

      {films.length > 0 ? <FilmGrid films={films} /> : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun film trouvé pour ce réalisateur.</p>
        </div>
      )}
    </div>
  );
}
