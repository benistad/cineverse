import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Cette page sert de redirection des anciennes URLs avec ID vers les nouvelles URLs avec slug
 * Par exemple: /film/123 -> /films/nom-du-film
 * Utilise une redirection côté serveur pour améliorer le SEO
 */
export default async function FilmPageRedirect({ params }) {
  try {
    // Récupérer l'ID du film depuis les paramètres d'URL
    const filmId = params.id;
    if (!filmId) {
      redirect('/not-found');
      return null;
    }
    
    // Initialiser le client Supabase côté serveur
    const supabase = createServerClient();
    
    // Récupérer le film par son ID
    const { data: film, error } = await supabase
      .from('films')
      .select('id, title, slug')
      .eq('id', filmId)
      .single();
    
    if (error || !film) {
      console.error('Erreur lors de la récupération du film:', error);
      redirect('/not-found');
      return null;
    }
    
    // Vérifier si le film a déjà un slug
    if (film.slug) {
      // Rediriger vers l'URL avec le slug
      redirect(`/films/${film.slug}`);
      return null;
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
    
    // Rediriger vers l'URL avec le slug avec un code 301 (redirection permanente)
    redirect(`/films/${newSlug}`);
  } catch (error) {
    console.error('Erreur lors de la redirection:', error);
    redirect('/not-found');
  }
  
  return null;
}
