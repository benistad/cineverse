/**
 * Normalise une chaîne de caractères en slug URL-friendly
 * Remplace les caractères accentués par leurs équivalents non accentués
 * Gère tous les accents : à, è, é, ù, etc.
 * 
 * @param {string} text - Texte à convertir en slug
 * @returns {string} - Slug normalisé
 */
export function slugify(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Normaliser les caractères Unicode (décompose les caractères accentués)
    .normalize('NFD')
    // Supprimer les diacritiques (accents)
    .replace(/[\u0300-\u036f]/g, '')
    // Gestion explicite des caractères qui pourraient ne pas être normalisés
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/ñ/g, 'n')
    .replace(/ç/g, 'c')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    // Supprimer les apostrophes (pas de tiret pour l'article)
    .replace(/[''`]/g, '')
    // Remplacer les espaces et underscores par des tirets
    .replace(/[\s_]+/g, '-')
    // Supprimer tous les caractères non alphanumériques sauf les tirets
    .replace(/[^\w-]+/g, '')
    // Remplacer les tirets multiples par un seul tiret
    .replace(/--+/g, '-')
    // Supprimer les tirets au début et à la fin
    .replace(/^-+|-+$/g, '');
}

/**
 * Génère un slug à partir d'un titre de film
 * Utilise le titre si disponible, sinon retourne l'ID
 * 
 * @param {Object} film - Objet film avec title et id
 * @returns {string} - Slug généré
 */
export function generateFilmSlug(film) {
  if (!film) return '';
  
  if (film.slug) {
    // Si le film a déjà un slug, le normaliser
    return slugify(film.slug);
  }
  
  if (film.title) {
    return slugify(film.title);
  }
  
  // Fallback sur l'ID si pas de titre
  return film.id ? film.id.toString() : '';
}
