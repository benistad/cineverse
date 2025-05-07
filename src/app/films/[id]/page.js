import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFilmById } from '@/lib/supabase/films';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import { FiStar } from 'react-icons/fi';
import YouTube from 'react-youtube';

export const revalidate = 3600; // Revalider la page toutes les heures

export default async function FilmPage({ params }) {
  const film = await getFilmById(params.id);

  if (!film) {
    notFound();
  }

  // Les métadonnées doivent être générées en dehors de la fonction principale

  return (
    <div className="container mx-auto px-4 py-8">
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
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">Note:</span>
                <span className="flex items-center">
                  <FiStar className="text-yellow-500 mr-1" />
                  {film.note}/10
                </span>
              </div>
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
