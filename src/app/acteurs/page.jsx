import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

export const metadata = {
  title: 'Acteurs et actrices de films',
  description: 'Découvrez les acteurs et actrices avec leurs filmographies. Leonardo DiCaprio, Margot Robbie, et plus.',
  alternates: { canonical: 'https://www.moviehunt.fr/acteurs' },
};

function slugify(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const getActorsWithCounts = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('remarkable_staff')
      .select('name')
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
      .map(([name, count]) => ({ name, slug: slugify(name), count }));
  },
  ['actors-list'],
  { revalidate: 86400, tags: ['actors'] }
);

export default async function ActorsPage() {
  const actors = await getActorsWithCounts();

  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Acteurs' }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">Acteurs & Actrices</h1>
        <p className="text-xl text-gray-600">Explorez les filmographies de {actors.length} acteurs</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {actors.map(a => (
          <Link key={a.slug} href={`/acteur/${a.slug}`}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h2 className="font-semibold text-gray-800">{a.name}</h2>
            <p className="text-sm text-gray-500">{a.count} films</p>
          </Link>
        ))}
      </div>

      {actors.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun acteur trouvé.</p>
        </div>
      )}
    </div>
  );
}
