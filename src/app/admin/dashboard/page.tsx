import Link from 'next/link';
import { getAllFilms } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import { FiPlus, FiSearch } from 'react-icons/fi';

export const metadata = {
  title: 'Dashboard - CineVerse',
  description: 'Gérez votre collection de films',
};

export default async function DashboardPage() {
  // Récupérer tous les films notés
  const films = await getAllFilms();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-gray-600">
            Gérez votre collection de {films.length} film{films.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link
            href="/admin/search"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiSearch /> Rechercher un film
          </Link>
        </div>
      </div>

      {films.length > 0 ? (
        <FilmGrid films={films} showAdminControls={true} />
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Aucun film noté</h2>
          <p className="text-gray-600 mb-8">
            Commencez par rechercher et noter votre premier film !
          </p>
          <Link
            href="/admin/search"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> Ajouter un film
          </Link>
        </div>
      )}
    </div>
  );
}
