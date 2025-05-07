'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { getImageUrl } from '@/lib/tmdb/api';
import { getSupabaseClient } from '@/lib/supabase/config';

export default function RemarkableStaffList({ filmId, staff: initialStaff }) {
  const [staff, setStaff] = useState(initialStaff || []);
  const [loading, setLoading] = useState(!initialStaff);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si le staff est déjà fourni ou s'il n'y a pas d'ID de film, ne pas charger les données
    if (initialStaff || !filmId) {
      return;
    }

    async function fetchStaff() {
      try {
        setLoading(true);
        const supabase = getSupabaseClient();
        
        if (!supabase) {
          throw new Error('Client Supabase non initialisé');
        }

        const { data, error } = await supabase
          .from('remarkable_staff')
          .select('*')
          .eq('film_id', filmId);

        if (error) {
          throw error;
        }

        setStaff(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération du staff:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, [filmId, initialStaff]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Erreur lors du chargement du staff.</p>
      </div>
    );
  }

  if (!staff || staff.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Aucun membre du staff remarquable.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {staff.map((person) => (
        <div key={person.id || Math.random().toString(36).substring(7)} className="flex flex-col items-center">
          <div className="relative h-32 w-32 rounded-full overflow-hidden mb-2">
            <SafeImage
              src={person.photo_url}
              alt={person.nom || 'Photo du staff'}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <h4 className="text-center font-medium">{person.nom || 'Inconnu'}</h4>
          <p className="text-center text-sm text-gray-600">{person.role || 'Rôle non spécifié'}</p>
        </div>
      ))}
    </div>
  );
}
