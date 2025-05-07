import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFilmById } from '@/lib/supabase/films';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import { FiStar } from 'react-icons/fi';
import YouTube from 'react-youtube';

export const revalidate = 3600; // Revalider la page toutes les heures

interface FilmPageProps {
  params: {
    id: string;
  };
}

export default async function FilmPage({ params }: FilmPageProps) {
  const film = await getFilmById(params.id);

  if (!film) {
    notFound();
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Backdrop */}
      {film.backdrop_url && (
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={film.backdrop_url}
            alt={film.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster et note */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={film.poster_url || '/placeholder-poster.jpg'}
                alt={film.title}
                width={300}
                height={450}
                className="w-full h-auto"
                priority
              />
              <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-3 flex items-center justify-center shadow-md">
                <FiStar className="mr-1" />
                <span className="font-bold text-lg">{film.note_sur_10}</span>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{film.title}</h1>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p className="text-gray-700">{film.synopsis}</p>
            </div>

            {/* Bande-annonce */}
            {film.youtube_trailer_key && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Bande-annonce</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <YouTube
                    videoId={film.youtube_trailer_key}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 0,
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Staff remarquable */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Staff Remarquable</h2>
              <RemarkableStaffList staff={film.remarkable_staff} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
