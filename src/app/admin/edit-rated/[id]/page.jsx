'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import DeleteFilmButton from '@/components/films/DeleteFilmButton';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import YouTube from 'react-youtube';
import { createBrowserClient } from '@supabase/ssr';

export default function EditRatedPage() {
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
        <h2 className="text-2xl font-bold mb-4">MovieHunt's Picks</h2>
        <RemarkableStaffList filmId={film.id} />
      </div>
    </div>
  );
}
