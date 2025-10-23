/**
 * Utilitaires pour la manipulation de chaînes de caractères
 */

/**
 * Normalise une chaîne en supprimant les accents
 * @param {string} str - La chaîne à normaliser
 * @returns {string} - La chaîne sans accents
 * 
 * @example
 * removeAccents('Procès') // 'Proces'
 * removeAccents('élève') // 'eleve'
 * removeAccents('café') // 'cafe'
 * removeAccents('à la') // 'a la'
 * removeAccents('où') // 'ou'
 */
export function removeAccents(str) {
  if (!str) return '';
  
  return str
    .normalize('NFD') // Décompose les caractères accentués (é → e + ´, à → a + `, etc.)
    .replace(/[\u0300-\u036f]/g, '') // Supprime tous les diacritiques (accents)
    .replace(/œ/g, 'oe') // Remplace œ par oe
    .replace(/Œ/g, 'OE') // Remplace Œ par OE
    .replace(/æ/g, 'ae') // Remplace æ par ae
    .replace(/Æ/g, 'AE') // Remplace Æ par AE
    // Gestion explicite des caractères qui pourraient ne pas être normalisés
    .replace(/[àáâãäå]/gi, 'a')
    .replace(/[èéêë]/gi, 'e')
    .replace(/[ìíîï]/gi, 'i')
    .replace(/[òóôõö]/gi, 'o')
    .replace(/[ùúûü]/gi, 'u')
    .replace(/[ýÿ]/gi, 'y')
    .replace(/ñ/gi, 'n')
    .replace(/ç/gi, 'c');
}

/**
 * Crée un slug à partir d'une chaîne
 * @param {string} str - La chaîne à convertir en slug
 * @returns {string} - Le slug normalisé
 * 
 * @example
 * createSlug('Le Procès du siècle') // 'le-proces-du-siecle'
 * createSlug('L\'Été meurtrier') // 'l-ete-meurtrier'
 */
export function createSlug(str) {
  if (!str) return '';
  
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux sauf espaces et tirets
    .replace(/[\s_]+/g, '-') // Remplace espaces et underscores par des tirets
    .replace(/-+/g, '-') // Remplace plusieurs tirets par un seul
    .replace(/^-+|-+$/g, ''); // Supprime les tirets au début et à la fin
}

/**
 * Compare deux chaînes en ignorant les accents et la casse
 * @param {string} str1 - Première chaîne
 * @param {string} str2 - Deuxième chaîne
 * @returns {boolean} - true si les chaînes sont équivalentes
 * 
 * @example
 * compareIgnoreAccents('Procès', 'proces') // true
 * compareIgnoreAccents('élève', 'ELEVE') // true
 */
export function compareIgnoreAccents(str1, str2) {
  if (!str1 || !str2) return false;
  
  return removeAccents(str1).toLowerCase() === removeAccents(str2).toLowerCase();
}
