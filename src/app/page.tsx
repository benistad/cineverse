import { getAllFilms } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';

export const revalidate = 3600; // Revalider la page toutes les heures

export default async function Home() {
  // Récupérer tous les films notés
  const films = await getAllFilms();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Bienvenue sur CineVerse</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Découvrez ma collection de films notés et mes recommandations de casting et d&apos;équipe technique.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Films récemment notés</h2>
        {films.length > 0 ? (
          <FilmGrid films={films} />
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">Aucun film noté pour le moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}
