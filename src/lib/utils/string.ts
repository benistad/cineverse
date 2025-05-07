/**
 * Crée un slug à partir d'une chaîne de caractères
 * Exemple: "Le Seigneur des Anneaux" -> "le-seigneur-des-anneaux"
 */
export function createSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD') // Normaliser les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/--+/g, '-') // Remplacer les tirets multiples par un seul
    .trim(); // Supprimer les espaces en début et fin de chaîne
}

/**
 * Tronque un texte à une longueur donnée et ajoute "..." si nécessaire
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Formate une date au format "DD/MM/YYYY"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Extrait l'année d'une date
 */
export function extractYear(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear().toString();
}
