import { notFound } from 'next/navigation';
import { getMovieDetails } from '@/lib/tmdb/api';
import FilmEditor from '@/components/films/FilmEditor';

export const metadata = {
  title: 'Éditer un film - CineVerse',
  description: 'Éditer les détails d\'un film',
};

export default async function EditPage({ params }) {
  // Récupérer les détails du film depuis TMDB
  const movieId = parseInt(params.id, 10);
  
  if (isNaN(movieId)) {
    notFound();
  }
  
  try {
    const movie = await getMovieDetails(movieId);
    
    if (!movie) {
      notFound();
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <FilmEditor movie={movie} />
      </div>
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du film:', error);
    notFound();
  }
}
