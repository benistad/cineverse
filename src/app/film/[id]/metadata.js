/**
 * Métadonnées pour les pages de redirection d'anciens films
 * Indique aux moteurs de recherche que ces pages sont des redirections
 */
export default function generateMetadata({ params }) {
  return {
    title: 'Redirection vers la page du film',
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `/films/${params.id}`,
    }
  };
}
