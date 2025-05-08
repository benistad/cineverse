'use client';

import React, { useEffect, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { useParams, useRouter } from 'next/navigation';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import RatingIcon from '@/components/ui/RatingIcon';
import YouTube from 'react-youtube';
import { createBrowserClient } from '@supabase/ssr';

export default function FilmPage() {
  const params = useParams();
  const router = useRouter();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function fetchFilm() {
      try {
        const { data, error } = await supabase
          .from('films')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du film:', error);
          router.push('/not-found');
          return;
        }

        setFilm(data);
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/not-found');
      } finally {
        setLoading(false);
      }
    }

    fetchFilm();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Film non trouvé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
            <div className="w-full rounded-lg shadow-md overflow-hidden">
              <SafeImage
                src={film.poster_url}
                alt={film.title || 'Poster du film'}
                width={500}
                height={750}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{film.title}</h1>
            
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Date d'ajout:</span> {new Date(film.date_ajout).toLocaleDateString('fr-FR')}
            </p>
            
            <div className="flex items-center mb-2">
              <span className="font-semibold mr-2">Note:</span>
              <span className="flex items-center">
                <RatingIcon rating={film.note_sur_10} className="mr-2" />
                {film.note_sur_10}/10
              </span>
            </div>
            

            
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p className="text-gray-700">{film.synopsis || 'Aucun synopsis disponible.'}</p>
            </div>
            
            {film.why_watch_enabled && film.why_watch_content && (
              <div className="mb-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold mb-2 text-blue-800">Pourquoi regarder ce film ?</h2>
                <div 
                  className="text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: film.why_watch_content }}
                />
              </div>
            )}
            
            {film.youtube_trailer_key && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Bande-annonce</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <YouTube videoId={film.youtube_trailer_key} className="w-full" />
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
