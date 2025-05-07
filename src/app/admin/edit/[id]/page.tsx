import { notFound } from 'next/navigation';
import { getMovieDetails } from '@/lib/tmdb/api';
import FilmEditor from '@/components/films/FilmEditor';

export const metadata = {
  title: 'Éditer un film - CineVerse',
  description: 'Ajouter ou modifier un film dans votre collection',
};

export default async function EditPage({ params }: { params: { id: string } }) {
  // Récupérer les détails du film depuis TMDB
  const movieId = parseInt(params.id, 10);
  
  if (isNaN(movieId)) {
    notFound();
  }
  
  const movieDetails = await getMovieDetails(movieId);
  
  if (!movieDetails) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Éditer un film</h1>
        <p className="text-gray-600">
          Notez ce film et sélectionnez le staff remarquable
        </p>
      </div>

      <FilmEditor movieDetails={movieDetails} />
    </div>
  );
}
