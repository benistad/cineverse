'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * Composant pour ajouter une balise title à chaque page
 * Ce composant utilise un script côté client pour injecter la balise title
 * dans le head du document après le chargement de la page
 */
export default function TitleTag() {
  const pathname = usePathname();
  
  // Fonction pour déterminer le titre en fonction du chemin
  const getTitle = (path) => {
    // Titre par défaut
    let title = 'MovieHunt - Trouvez votre prochain film coup de cœur';
    
    // Titres spécifiques pour chaque page
    if (path === '/') {
      title = 'MovieHunt - Trouvez votre prochain film coup de cœur';
    } else if (path === '/search') {
      title = 'Recherche de films | MovieHunt';
    } else if (path === '/advanced-search') {
      title = 'Recherche avancée de films | MovieHunt';
    } else if (path === '/all-films') {
      title = 'Tous les films | MovieHunt';
    } else if (path === '/huntedbymoviehunt') {
      title = 'Hunted by MovieHunt | Films exceptionnels sélectionnés par notre équipe';
    } else if (path === '/quel-film-regarder') {
      title = 'Quel film regarder ce soir ? Top 10 des films à voir absolument | MovieHunt';
    } else if (path === '/top-rated') {
      title = 'Films les mieux notés | MovieHunt';
    } else if (path === '/hidden-gems') {
      title = 'Films méconnus à voir | Perles rares du cinéma | MovieHunt';
    } else if (path.startsWith('/films/')) {
      // Pour les pages de films individuelles, on utilise un titre générique
      // Le titre exact sera remplacé par le script fetchFilmTitle ci-dessous
      title = 'Détails du film | MovieHunt';
    }
    
    return title;
  };
  
  // Obtenir le titre pour la page actuelle
  const pageTitle = getTitle(pathname);
  
  // Script qui injecte la balise title dans le head
  const injectTitleScript = `
    (function() {
      // Supprimer toute balise title existante
      const existingTitle = document.querySelector('title');
      if (existingTitle) {
        existingTitle.remove();
      }
      
      // Créer et ajouter la nouvelle balise title
      const titleElement = document.createElement('title');
      titleElement.textContent = '${pageTitle}';
      document.head.appendChild(titleElement);
      
      // Pour les pages de films, récupérer le titre exact du film
      if (window.location.pathname.startsWith('/films/')) {
        const fetchFilmTitle = async () => {
          try {
            const slug = window.location.pathname.split('/films/')[1];
            // Essayer de récupérer le titre du film depuis les métadonnées de la page
            const h1Element = document.querySelector('h1');
            if (h1Element && h1Element.textContent) {
              titleElement.textContent = h1Element.textContent + ' | MovieHunt';
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du titre du film:', error);
          }
        };
        
        // Exécuter après un court délai pour s'assurer que le DOM est chargé
        setTimeout(fetchFilmTitle, 500);
      }
    })();
  `;

  return (
    <Script
      id="title-tag"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: injectTitleScript }}
    />
  );
}
