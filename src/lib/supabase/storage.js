'use client';

import { getSupabaseClient } from './config';

const CAROUSEL_BUCKET = 'carousel-images';

/**
 * Télécharge une image depuis une URL externe et la stocke dans Supabase Storage
 * @param {string} imageUrl - URL de l'image à télécharger
 * @param {string} filmId - ID du film associé à l'image
 * @returns {Promise<string>} - URL de l'image stockée dans Supabase
 */
export async function downloadAndStoreImage(imageUrl, filmId) {
  try {
    // Récupérer l'image depuis l'URL externe
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Erreur lors du téléchargement de l'image: ${response.statusText}`);
    }
    
    const imageBlob = await response.blob();
    const fileName = `film_${filmId}.jpg`;
    
    // Stocker l'image dans Supabase Storage
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .storage
      .from(CAROUSEL_BUCKET)
      .upload(fileName, imageBlob, {
        upsert: true, // Remplacer si le fichier existe déjà
        contentType: 'image/jpeg',
      });
    
    if (error) {
      console.error('Erreur lors du stockage de l\'image:', error);
      return null;
    }
    
    // Récupérer l'URL publique de l'image
    const { data: publicUrlData } = supabase
      .storage
      .from(CAROUSEL_BUCKET)
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Erreur lors du téléchargement et stockage de l\'image:', error);
    return null;
  }
}

/**
 * Récupère les images stockées dans le bucket du carrousel
 * @returns {Promise<Array>} - Liste des fichiers dans le bucket
 */
export async function getStoredCarouselImages() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .storage
    .from(CAROUSEL_BUCKET)
    .list();
  
  if (error) {
    console.error('Erreur lors de la récupération des images du carrousel:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Supprime les images qui ne sont plus nécessaires dans le carrousel
 * @param {Array<string>} activeFilmIds - IDs des films actuellement dans le carrousel
 * @returns {Promise<boolean>} - True si la suppression a réussi
 */
export async function cleanupCarouselImages(activeFilmIds) {
  try {
    // Récupérer toutes les images stockées
    const storedImages = await getStoredCarouselImages();
    
    // Identifier les images à supprimer (celles qui ne correspondent pas aux films actifs)
    const imagesToDelete = storedImages
      .filter(file => {
        // Extraire l'ID du film du nom de fichier (film_123.jpg -> 123)
        const match = file.name.match(/film_(\d+)\.jpg/);
        if (!match) return false;
        
        const fileFilmId = match[1];
        return !activeFilmIds.includes(fileFilmId);
      })
      .map(file => file.name);
    
    if (imagesToDelete.length === 0) {
      return true; // Rien à supprimer
    }
    
    // Supprimer les images qui ne sont plus nécessaires
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .storage
      .from(CAROUSEL_BUCKET)
      .remove(imagesToDelete);
    
    if (error) {
      console.error('Erreur lors de la suppression des images:', error);
      return false;
    }
    
    console.log(`${imagesToDelete.length} images supprimées du carrousel`);
    return true;
  } catch (error) {
    console.error('Erreur lors du nettoyage des images du carrousel:', error);
    return false;
  }
}
