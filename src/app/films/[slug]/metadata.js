import { getFilmBySlug } from '@/lib/supabase/server';

/**
 * Génère les métadonnées pour une page de film spécifique
 * Cette fonction est appelée par Next.js lors du rendu de la page
 * Optimisée pour le SEO avec des métadonnées riches et structurées
 */
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    // Récupérer les données du film depuis Supabase
    const film = await getFilmBySlug(slug);
    
    if (!film) {
      return {
        title: 'Film non trouvé',
        description: 'Le film que vous recherchez n\'a pas été trouvé sur MovieHunt.',
        robots: {
          index: false,
          follow: true,
        }
      };
    }
    
    // Extraire l'année de sortie si disponible
    const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
    
    // Extraire les genres pour les mots-clés
    const genres = film.genres ? film.genres.split(',').map(g => g.trim()) : [];
    
    // Construire la description SEO optimisée
    let description = `${film.title}`;
    if (releaseYear) description += ` (${releaseYear})`;
    if (film.note_sur_10) description += ` - Note: ${film.note_sur_10}/10 sur MovieHunt`;
    if (film.synopsis) {
      // Limiter la longueur du synopsis pour la description (entre 150-160 caractères idéalement)
      const shortSynopsis = film.synopsis.length > 150 
        ? film.synopsis.substring(0, 147) + '...' 
        : film.synopsis;
      description += `. ${shortSynopsis}`;
    }
    
    // Générer des mots-clés pertinents basés sur les données du film
    const keywords = [
      film.title,
      'film',
      'critique',
      'avis',
      'note',
      'cinéma',
      ...genres
    ];
    
    // Ajouter l'année et les acteurs/réalisateurs aux mots-clés si disponibles
    if (releaseYear) keywords.push(releaseYear.toString());
    if (film.remarkable_staff && Array.isArray(film.remarkable_staff)) {
      film.remarkable_staff.forEach(person => {
        if (person.name) keywords.push(person.name);
      });
    }
    
    // URL canonique pour cette page de film
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
    const canonicalUrl = `${baseUrl}/films/${slug}`;
    
    // Ajouter des balises robots spécifiques pour améliorer l'indexation
    const robotsConfig = {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      // Optimisations spécifiques pour les robots mobiles
      'googlebot-mobile': {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    };
    
    // Construire l'URL de l'image pour Open Graph et Twitter
    // Utiliser l'image du poster du film si disponible
    const posterUrl = film.poster_url || (film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : null);
    const ogImage = posterUrl
      ? posterUrl
      : `${baseUrl}/images/og-image.jpg`;
    
    // Titre optimisé pour le SEO (ne pas ajouter "| MovieHunt" ici : déjà ajouté via title.template global)
    const seoTitle = `${film.title}${releaseYear ? ` (${releaseYear})` : ''} - Critique et avis`;
    
    // Construire les données Open Graph pour les réseaux sociaux
    const openGraphData = {
      title: seoTitle,
      description,
      url: canonicalUrl,
      siteName: 'MovieHunt',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Affiche du film ${film.title}`,
        },
      ],
      locale: 'fr_FR',
      type: 'article',
      publishedTime: film.date_ajout,
      modifiedTime: film.date_modification || film.date_ajout,
      section: 'Films',
      tags: genres,
    };
    
    // Construire les données Twitter Card
    const twitterData = {
      card: 'summary_large_image',
      title: seoTitle,
      description,
      images: [ogImage],
      creator: '@MovieHuntFr',
      site: '@MovieHuntFr',
    };
    
    return {
      title: seoTitle,
      description,
      keywords: keywords.slice(0, 20), // Limiter à 20 mots-clés maximum
      openGraph: openGraphData,
      twitter: twitterData,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'fr-FR': canonicalUrl,
        },
      },
      robots: robotsConfig,
      authors: [{ name: 'MovieHunt', url: baseUrl }],
      category: 'entertainment',
      // Ajouter des métadonnées pour les applications mobiles
      appLinks: {
        ios: {
          url: canonicalUrl,
          app_name: 'MovieHunt',
        },
        android: {
          package: 'fr.moviehunt.app',
          url: canonicalUrl,
        },
      },
    };
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées:', error);
    
    // Métadonnées par défaut en cas d'erreur, en incluant le slug pour éviter les titres dupliqués
    return {
      title: `Erreur de chargement (${slug})`,
      description: 'Une erreur est survenue lors du chargement des informations de ce film. Veuillez réessayer ultérieurement.',
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'}/films/${slug}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}
