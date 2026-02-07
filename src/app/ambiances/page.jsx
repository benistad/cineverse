import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

export const metadata = {
  title: 'Films par ambiance et humeur',
  description: 'Trouvez le film parfait selon votre humeur : soirée couple, feel-good, frissons, action, réflexion...',
  alternates: { canonical: 'https://www.moviehunt.fr/ambiances' },
};

const MOODS = [
  { slug: 'soiree-couple', title: 'Soirée en couple', icon: '💕', color: 'from-pink-500 to-rose-500' },
  { slug: 'feel-good', title: 'Feel-good', icon: '😊', color: 'from-yellow-400 to-orange-400' },
  { slug: 'frissons', title: 'Frissons', icon: '😱', color: 'from-gray-700 to-gray-900' },
  { slug: 'action-intense', title: 'Action intense', icon: '💥', color: 'from-red-500 to-orange-500' },
  { slug: 'reflexion', title: 'Réflexion', icon: '🧠', color: 'from-purple-500 to-indigo-600' },
  { slug: 'rire', title: 'Pour rire', icon: '😂', color: 'from-green-400 to-teal-500' },
  { slug: 'famille', title: 'En famille', icon: '👨‍👩‍👧‍👦', color: 'from-blue-400 to-cyan-500' },
  { slug: 'suspense', title: 'Suspense', icon: '🔍', color: 'from-slate-600 to-slate-800' },
];

export default function MoodsPage() {
  const breadcrumbItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Par ambiance' }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Quel film selon votre humeur ?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choisissez l'ambiance qui correspond à votre envie du moment.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {MOODS.map((mood) => (
          <Link
            key={mood.slug}
            href={`/ambiance/${mood.slug}`}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
            <div className="relative p-6 text-white text-center">
              <span className="text-5xl mb-4 block">{mood.icon}</span>
              <h2 className="text-xl font-bold">{mood.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Autres façons de choisir</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/genres" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors">
            Par genre
          </Link>
          <Link href="/annees" className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors">
            Par année
          </Link>
          <Link href="/top-rated" className="px-6 py-3 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600 transition-colors">
            Les mieux notés
          </Link>
        </div>
      </section>
    </div>
  );
}
