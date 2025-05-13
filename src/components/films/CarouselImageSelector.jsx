import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/tmdb/api';

/**
 * Sauvegarde l'image du carrousel dans le localStorage
 */
function saveCarouselImageToLocalStorage(tmdbId, imagePath, imageUrl) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`carousel_image_${tmdbId}_path`, imagePath);
    localStorage.setItem(`carousel_image_${tmdbId}_url`, imageUrl);
    console.log('Image du carrousel sauvegardée dans le localStorage depuis CarouselImageSelector:', imagePath);
  }
}

/**
 * Composant pour la sélection d'une image pour le carrousel
 * Ce composant gère de manière autonome la sélection et la persistance de l'image
 */
export default function CarouselImageSelector({ 
  movieDetails, 
  initialImagePath = null,
  onImageSelect
}) {
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(initialImagePath);
  const [isLoading, setIsLoading] = useState(true);
  
  // Charger toutes les images disponibles pour ce film
  useEffect(() => {
    if (!movieDetails || !movieDetails.id) return;
    
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        console.log('Chargement des images pour le film ID:', movieDetails.id);
        
        // Initialiser le tableau d'images avec les images principales
        const images = [];
        
        // Ajouter l'image principale du backdrop si disponible
        if (movieDetails?.backdrop_path) {
          console.log('Ajout du backdrop principal:', movieDetails.backdrop_path);
          images.push({
            path: movieDetails.backdrop_path,
            type: 'backdrop',
            url: getImageUrl(movieDetails.backdrop_path, 'w1280')
          });
        }
        
        // Appel direct à l'API TMDB pour récupérer toutes les images
        const tmdbToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsIm5iZiI6MS43NDY1MTUwNTQyODE5OTk4ZSs5LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mI9mPVyASt5bsbRwtVN5eUs6uyz28Tvy-FRJTT6vdg8';
        const apiUrl = `https://api.themoviedb.org/3/movie/${movieDetails.id}/images`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tmdbToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const imagesData = await response.json();
        
        // Traiter tous les backdrops récupérés directement
        if (imagesData?.backdrops && imagesData.backdrops.length > 0) {
          imagesData.backdrops.forEach(backdrop => {
            // Éviter les doublons avec l'image principale du backdrop
            if (backdrop.file_path && backdrop.file_path !== movieDetails.backdrop_path) {
              images.push({
                path: backdrop.file_path,
                type: 'backdrop',
                url: getImageUrl(backdrop.file_path, 'w1280'),
                width: backdrop.width,
                height: backdrop.height,
                aspect_ratio: backdrop.aspect_ratio
              });
            }
          });
        }
        
        setAvailableImages(images);
        
        // Si une image initiale est fournie, vérifier qu'elle existe dans les images disponibles
        if (initialImagePath) {
          const imageExists = images.some(img => img.path === initialImagePath);
          
          if (!imageExists) {
            // Si l'image initiale n'existe pas dans les images disponibles, l'ajouter
            console.log('Ajout de l\'image initiale aux images disponibles:', initialImagePath);
            
            // Déterminer le type d'image
            const imageType = initialImagePath.includes('backdrop') ? 'backdrop' : 'poster';
            
            // Créer l'URL complète
            const imageUrl = getImageUrl(initialImagePath, 'original');
            
            // Ajouter l'image aux images disponibles
            setAvailableImages(prevImages => [
              ...prevImages,
              {
                path: initialImagePath,
                type: imageType,
                url: imageUrl
              }
            ]);
          }
          
          // Définir l'image sélectionnée
          setSelectedImage(initialImagePath);
        } else if (movieDetails?.backdrop_path) {
          // Si aucune image initiale n'est fournie, sélectionner l'image principale du backdrop
          setSelectedImage(movieDetails.backdrop_path);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImages();
  }, [movieDetails, initialImagePath]);
  
  // Gérer la sélection d'une image
  const handleImageSelect = (imagePath) => {
    setSelectedImage(imagePath);
    
    // Trouver l'objet image sélectionné
    const selectedImageObj = availableImages.find(img => img.path === imagePath);
    
    // Notifier le composant parent
    if (onImageSelect) {
      onImageSelect(imagePath, selectedImageObj?.url);
    }
    
    // Sauvegarder l'image sélectionnée dans le localStorage
    if (movieDetails && movieDetails.id) {
      saveCarouselImageToLocalStorage(movieDetails.id, imagePath, selectedImageObj?.url);
      console.log('Image sauvegardée dans localStorage lors de la sélection:', imagePath);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Image pour le carrousel principal</h2>
      <p className="text-gray-600 mb-4">Sélectionnez l'image qui sera utilisée pour le carrousel principal sur la page d'accueil.</p>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Chargement des images...</p>
        </div>
      ) : (
        <>
          {availableImages.length === 0 ? (
            <p className="text-gray-500 italic">Aucune image disponible</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {availableImages
                .filter(image => image.type === 'backdrop')
                .map((image, index) => (
                <div 
                  key={`backdrop-${index}`} 
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${selectedImage === image.path ? 'border-blue-500' : 'border-gray-200'}`}
                  onClick={() => handleImageSelect(image.path)}
                >
                  <img 
                    src={image.url} 
                    alt={`Backdrop ${index + 1}`} 
                    className="w-full h-auto"
                  />
                  {selectedImage === image.path && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
