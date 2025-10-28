'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllFilms } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import { FiPlus, FiSearch, FiRefreshCw, FiDatabase, FiGlobe } from 'react-icons/fi';

// Forcer le dynamic rendering pour éviter le pre-rendering
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilms() {
      try {
        const filmsData = await getAllFilms();
        setFilms(filmsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-gray-600">
            Gérez votre collection de {films.length} film{films.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/search"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiSearch /> Rechercher un film
          </Link>
          <Link
            href="/admin/translations"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            title="Traduire les films en anglais"
          >
            <FiGlobe /> Traductions
          </Link>
          <Link
            href="/admin/update-films"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <FiRefreshCw /> Mettre à jour les films
          </Link>
          <Link
            href="/admin/database-migration"
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            <FiDatabase /> Migration BDD
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
