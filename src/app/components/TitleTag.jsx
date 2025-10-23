'use client';

import { usePathname } from 'next/navigation';

/**
 * Composant pour ajouter une balise title à chaque page
 * Cette implémentation côté client est compatible avec le layout client
 */
export default function TitleTag() {
  // Récupérer le chemin actuel depuis le hook usePathname
  const pathname = usePathname() || '/';
  
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
    } else if (path === '/films-inconnus') {
      title = 'Films inconnus à voir | Perles rares du cinéma | MovieHunt';
    } else if (path.startsWith('/films/')) {
      // Pour les pages de films individuelles, on utilise un titre générique
      // Le titre exact sera remplacé par le script fetchFilmTitle ci-dessous
      title = 'Détails du film | MovieHunt';
    }
    
    return title;
  };
  
  // Obtenir le titre pour la page actuelle
  const pageTitle = getTitle(pathname);

  // Dans l'App Router, nous ne pouvons pas directement modifier le title,
  // mais nous pouvons ajouter une balise meta pour les robots
  return (
    <meta name="title" content={pageTitle} />
  );
}
