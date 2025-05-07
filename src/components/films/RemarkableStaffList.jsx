'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { getImageUrl } from '@/lib/tmdb/api';
import { getSupabaseClient } from '@/lib/supabase/config';

export default function RemarkableStaffList({ filmId, staff: initialStaff }) {
  const [staff, setStaff] = useState(initialStaff || []);
  const [groupedStaff, setGroupedStaff] = useState([]);
  const [loading, setLoading] = useState(!initialStaff);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si le staff est déjà fourni, le regrouper par nom
    if (initialStaff) {
      const grouped = initialStaff.reduce((acc, person) => {
        const existingPerson = acc.find(p => p.nom === person.nom);
        
        if (existingPerson) {
          existingPerson.roles.push(person.role);
        } else {
          acc.push({
            id: person.id,
            nom: person.nom,
            photo_url: person.photo_url,
            roles: [person.role]
          });
        }
        
        return acc;
      }, []);
      
      setGroupedStaff(grouped);
      return;
    }
    
    // S'il n'y a pas d'ID de film, ne pas charger les données
    if (!filmId) {
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

        const staffData = data || [];
        setStaff(staffData);
        
        // Regrouper le staff par nom
        const grouped = staffData.reduce((acc, person) => {
          const existingPerson = acc.find(p => p.nom === person.nom);
          
          if (existingPerson) {
            // Si cette personne existe déjà, ajouter ce rôle à ses rôles
            existingPerson.roles.push(person.role);
          } else {
            // Sinon, créer une nouvelle entrée avec ce rôle
            acc.push({
              id: person.id,
              nom: person.nom,
              photo_url: person.photo_url,
              roles: [person.role]
            });
          }
          
          return acc;
        }, []);
        
        setGroupedStaff(grouped);
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

  if (!groupedStaff || groupedStaff.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Aucun.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {groupedStaff.map((person) => (
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
          <div className="text-center text-sm text-gray-600">
            {person.roles.map((role, index) => (
              <p key={index}>{role}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
