import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

export const metadata = {
  title: 'Classements des meilleurs films | MovieHunt',
  description: 'Découvrez nos classements : Top 10, Top 20, Top 50 des meilleurs films par genre. Action, Comédie, Horreur, Thriller...',
  alternates: { canonical: 'https://www.moviehunt.fr/classements' },
};

const TOPS = [
  { slug: '20-meilleurs-films', title: 'Top 20 meilleurs films', icon: '🏆', featured: true },
  { slug: '50-meilleurs-films', title: 'Top 50 meilleurs films', icon: '⭐', featured: true },
  { slug: '10-films-action', title: 'Top 10 Action', icon: '💥' },
  { slug: '10-films-comedie', title: 'Top 10 Comédies', icon: '😂' },
  { slug: '10-films-horreur', title: 'Top 10 Horreur', icon: '👻' },
  { slug: '10-films-thriller', title: 'Top 10 Thrillers', icon: '😱' },
  { slug: '10-films-drame', title: 'Top 10 Drames', icon: '🎭' },
  { slug: '10-films-science-fiction', title: 'Top 10 Sci-Fi', icon: '🚀' },
  { slug: '10-films-animation', title: 'Top 10 Animation', icon: '🎨' },
  { slug: '10-films-romance', title: 'Top 10 Romance', icon: '💕' },
];

export default function ClassementsPage() {
  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Classements' }
  ];

  const featured = TOPS.filter(t => t.featured);
  const byGenre = TOPS.filter(t => !t.featured);

  return (
    <div className="container mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Classements des meilleurs films
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Nos sélections des meilleurs films, classés par note.
        </p>
      </header>

      {/* Classements principaux */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Classements généraux</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((top) => (
            <Link
              key={top.slug}
              href={`/top/${top.slug}`}
              className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <span className="text-5xl mb-4 block">{top.icon}</span>
              <h3 className="text-2xl font-bold">{top.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Classements par genre */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Top 10 par genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {byGenre.map((top) => (
            <Link
              key={top.slug}
              href={`/top/${top.slug}`}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center"
            >
              <span className="text-4xl mb-2 block">{top.icon}</span>
              <h3 className="font-semibold text-gray-800">{top.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explorer autrement</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/ambiances" className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors">
            Par ambiance
          </Link>
          <Link href="/genres" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors">
            Par genre
          </Link>
          <Link href="/annees" className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors">
            Par année
          </Link>
        </div>
      </section>
    </div>
  );
}
