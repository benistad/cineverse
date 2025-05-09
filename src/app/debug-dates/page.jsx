'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function DebugDatesPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilms() {
      try {
        const { data, error } = await supabase
          .from('films')
          .select('id, title, release_date')
          .limit(10);
        
        if (error) throw error;
        setFilms(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Débogage des dates</h1>
      
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Format des dates de sortie</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Titre</th>
                <th className="border p-2 text-left">Date de sortie (brute)</th>
                <th className="border p-2 text-left">Année extraite</th>
              </tr>
            </thead>
            <tbody>
              {films.map(film => (
                <tr key={film.id} className="border-b">
                  <td className="border p-2">{film.id}</td>
                  <td className="border p-2">{film.title}</td>
                  <td className="border p-2">{film.release_date || 'Non définie'}</td>
                  <td className="border p-2">
                    {film.release_date ? new Date(film.release_date).getFullYear() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
