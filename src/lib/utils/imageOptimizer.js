/**
 * Utilitaires pour optimiser les images, particulièrement celles provenant de TMDB
 * Permet d'améliorer les performances mobiles en utilisant des tailles d'images appropriées
 */

/**
 * Optimise une URL d'image TMDB en remplaçant le format "original" par une taille plus appropriée
 * @param {string} url - L'URL de l'image à optimiser
 * @param {string} size - La taille souhaitée (w300, w500, w780, w1280)
 * @returns {string} L'URL optimisée
 */
export function optimizeTmdbImage(url, size = 'w500') {
  if (!url) return '';
  
  // Si l'URL n'est pas de TMDB, la retourner telle quelle
  if (!url.includes('image.tmdb.org')) return url;
  
  // Vérifier si l'URL contient déjà une taille optimisée
  const sizeRegex = /\/[tw][0-9]+\//;
  if (sizeRegex.test(url)) return url;
  
  // Remplacer "original" par la taille spécifiée
  return url.replace('/original/', `/${size}/`);
}

/**
 * Optimise une URL d'image d'affiche de film
 * @param {string} url - L'URL de l'affiche à optimiser
 * @returns {string} L'URL optimisée
 */
export function optimizePosterImage(url) {
  // Pour les affiches, w500 est généralement suffisant
  return optimizeTmdbImage(url, 'w500');
}

/**
 * Optimise une URL d'image d'arrière-plan (backdrop) de film
 * @param {string} url - L'URL de l'image d'arrière-plan à optimiser
 * @returns {string} L'URL optimisée
 */
export function optimizeBackdropImage(url) {
  // Pour les arrière-plans, w1280 est généralement approprié
  return optimizeTmdbImage(url, 'w1280');
}

/**
 * Optimise une URL d'image de profil (acteur, réalisateur)
 * @param {string} url - L'URL de l'image de profil à optimiser
 * @returns {string} L'URL optimisée
 */
export function optimizeProfileImage(url) {
  // Pour les images de profil, w300 est généralement suffisant
  return optimizeTmdbImage(url, 'w300');
}

/**
 * Optimise une URL d'image de logo (fournisseur de streaming)
 * @param {string} url - L'URL du logo à optimiser
 * @returns {string} L'URL optimisée
 */
export function optimizeLogoImage(url) {
  // Pour les logos, w300 est généralement suffisant
  return optimizeTmdbImage(url, 'w300');
}
