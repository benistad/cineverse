import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FilmGrid from '@/components/films/FilmGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

function slugify(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const getPopularActors = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('remarkable_staff')
      .select('name, film_id')
      .in('role', ['Acteur', 'Actrice']);

    if (error || !data) return [];

    const counts = {};
    data.forEach(d => {
      if (!counts[d.name]) counts[d.name] = 0;
      counts[d.name]++;
    });

    return Object.entries(counts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([name, count]) => ({ name, slug: slugify(name), count }));
  },
  ['popular-actors'],
  { revalidate: 86400, tags: ['actors'] }
);

const getFilmsByActor = unstable_cache(
  async (actorName) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: staffData } = await supabase
      .from('remarkable_staff')
      .select('film_id')
      .in('role', ['Acteur', 'Actrice'])
      .ilike('name', actorName);

    if (!staffData || staffData.length === 0) return [];

    const filmIds = staffData.map(s => s.film_id);

    const { data: films } = await supabase
      .from('films')
      .select('*')
      .in('id', filmIds)
      .order('release_date', { ascending: false });

    return films || [];
  },
  ['films-by-actor'],
  { revalidate: 3600, tags: ['actors'] }
);

export async function generateStaticParams() {
  const actors = await getPopularActors();
  return actors.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const actors = await getPopularActors();
  const actor = actors.find(a => a.slug === params.slug);
  
  if (!actor) return { title: 'Acteur non trouvé | MovieHunt' };

  const films = await getFilmsByActor(actor.name);

  return {
    title: `Films avec ${actor.name} : ${films.length} films | MovieHunt`,
    description: `Découvrez tous les films avec ${actor.name}. Filmographie complète avec notes et critiques.`,
    keywords: [`films ${actor.name}`, `filmographie ${actor.name}`, 'acteur', 'actrice'],
    alternates: { canonical: `https://www.moviehunt.fr/acteur/${params.slug}` },
    openGraph: {
      title: `Films avec ${actor.name} | MovieHunt`,
      description: `Filmographie de ${actor.name} - ${films.length} films`,
    },
  };
}

export default async function ActorPage({ params }) {
  const actors = await getPopularActors();
  const actor = actors.find(a => a.slug === params.slug);
  
  if (!actor) notFound();

  const films = await getFilmsByActor(actor.name);

  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Acteurs', href: '/acteurs' },
    { name: actor.name }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Films avec {actor.name}
        </h1>
        <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
          {films.length} films
        </span>
      </header>

      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Autres acteurs</h2>
        <div className="flex flex-wrap gap-2">
          {actors.filter(a => a.slug !== params.slug).slice(0, 8).map(a => (
            <Link key={a.slug} href={`/acteur/${a.slug}`}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-indigo-50 transition-colors">
              {a.name}
            </Link>
          ))}
          <Link href="/acteurs"
            className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors">
            Tous →
          </Link>
        </div>
      </nav>

      {films.length > 0 ? <FilmGrid films={films} /> : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun film trouvé.</p>
        </div>
      )}
    </div>
  );
}
