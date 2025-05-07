import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getFilmById } from '@/lib/supabase/films';
import { FiArrowLeft } from 'react-icons/fi';
import DeleteFilmButton from '@/components/films/DeleteFilmButton';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import YouTube from 'react-youtube';

// Génération des métadonnées pour la page
export async function generateMetadata({ params }) {
  const film = await getFilmById(params.id);
  if (!film) {
    return {
      title: 'Film non trouvé - CineVerse',
      description: 'Le film demandé n\'a pas été trouvé',
    };
  }
  
  return {
    title: `Éditer ${film.titre} - CineVerse`,
    description: `Éditer les détails du film ${film.titre}`,
  };
}

export default async function EditRatedPage({ params }) {
  // Récupérer les détails du film depuis Supabase
  const film = await getFilmById(params.id);
  
  if (!film) {
    notFound();
  }

  // Les métadonnées doivent être générées dynamiquement

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/admin/dashboard" className="flex items-center text-blue-500 hover:text-blue-700">
          <FiArrowLeft className="mr-2" />
          Retour au tableau de bord
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          {film.poster_path && (
            <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
              <Image
                src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                alt={film.titre}
                width={300}
                height={450}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{film.titre}</h1>
            
            {film.date_sortie && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Date de sortie:</span> {new Date(film.date_sortie).toLocaleDateString('fr-FR')}
              </p>
            )}
            
            {film.note && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Note:</span> {film.note}/10
              </p>
            )}
            
            {film.genres && (
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Genres:</span> {film.genres}
              </p>
            )}
            
            {film.synopsis && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                <p className="text-gray-700">{film.synopsis}</p>
              </div>
            )}
            
            {film.trailer_key && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Bande-annonce</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <YouTube videoId={film.trailer_key} className="w-full" />
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Link 
                href={`/admin/edit/${film.tmdb_id}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Modifier
              </Link>
              <DeleteFilmButton filmId={film.id} filmTitle={film.titre} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Personnel remarquable</h2>
        <RemarkableStaffList filmId={film.id} />
      </div>
    </div>
  );
}
