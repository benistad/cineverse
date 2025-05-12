'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Cette page sert de redirection des anciennes URLs avec ID vers les nouvelles URLs avec slug
 * Par exemple: /film/123 -> /films/nom-du-film
 */
export default function FilmPageRedirect() {
  const params = useParams();
  const router = useRouter();
  
  useEffect(() => {
    async function redirectToSlugUrl() {
      try {
        // Récupérer l'ID du film depuis les paramètres d'URL
        const filmId = params.id;
        if (!filmId) {
          router.push('/not-found');
          return;
        }
        
        // Initialiser le client Supabase
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        // Récupérer le film par son ID
        const { data: film, error } = await supabase
          .from('films')
          .select('id, title, slug')
          .eq('id', filmId)
          .single();
        
        if (error || !film) {
          console.error('Erreur lors de la récupération du film:', error);
          router.push('/not-found');
          return;
        }
        
        // Vérifier si le film a déjà un slug
        if (film.slug) {
          // Rediriger vers l'URL avec le slug
          router.replace(`/films/${film.slug}`);
          return;
        }
        
        // Si le film n'a pas de slug, en créer un à partir du titre
        const newSlug = film.title
          ? film.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
              .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
              .replace(/--+/g, '-') // Éviter les tirets multiples
          : filmId; // Utiliser l'ID comme fallback si pas de titre
        
        // Mettre à jour le film avec le nouveau slug
        const { error: updateError } = await supabase
          .from('films')
          .update({ slug: newSlug })
          .eq('id', filmId);
        
        if (updateError) {
          console.error('Erreur lors de la mise à jour du slug:', updateError);
        }
        
        // Rediriger vers l'URL avec le slug
        router.replace(`/films/${newSlug}`);
      } catch (error) {
        console.error('Erreur lors de la redirection:', error);
        router.push('/not-found');
      }
    }
    
    redirectToSlugUrl();
  }, [params.id, router]);

  // Afficher un indicateur de chargement pendant la redirection
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
}
