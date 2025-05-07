'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { deleteFilm } from '@/lib/supabase/films';

interface DeleteFilmButtonProps {
  filmId: string;
  filmTitle: string;
}

export default function DeleteFilmButton({ filmId, filmTitle }: DeleteFilmButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const success = await deleteFilm(filmId);
      
      if (success) {
        // Rediriger vers le dashboard après suppression
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        throw new Error('Échec de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du film:', error);
      alert('Une erreur est survenue lors de la suppression du film. Veuillez réessayer.');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsConfirmOpen(true)}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        disabled={isDeleting}
      >
        <FiTrash2 /> Supprimer
      </button>

      {/* Modal de confirmation */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer le film <strong>&quot;{filmTitle}&quot;</strong> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                <FiX /> Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Suppression...
                  </>
                ) : (
                  <>
                    <FiCheck /> Confirmer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
