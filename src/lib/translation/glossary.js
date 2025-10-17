/**
 * Glossaire et règles de traduction pour améliorer la qualité DeepL
 * Contient des termes spécifiques au cinéma et des corrections post-traduction
 */

/**
 * Glossaire de termes cinématographiques FR → EN
 * Ces termes seront remplacés avant l'envoi à DeepL pour garantir la bonne traduction
 */
export const CINEMA_GLOSSARY = {
  // Aspects techniques du film
  'Pour la réalisation': 'For its direction',
  'pour la réalisation': 'for its direction',
  'Pour la photographie': 'For its cinematography',
  'pour la photographie': 'for its cinematography',
  'Pour la mise en scène': 'For its staging',
  'pour la mise en scène': 'for its staging',
  'Pour le montage': 'For its editing',
  'pour le montage': 'for its editing',
  'Pour la bande originale': 'For its soundtrack',
  'pour la bande originale': 'for its soundtrack',
  'Pour les effets spéciaux': 'For its special effects',
  'pour les effets spéciaux': 'for its special effects',
  'Pour les décors': 'For its sets',
  'pour les décors': 'for its sets',
  'Pour les costumes': 'For its costumes',
  'pour les costumes': 'for its costumes',
  
  // Performances d'acteurs
  'Pour la performance de': 'For the performance of',
  'pour la performance de': 'for the performance of',
  'Pour le jeu de': 'For the acting of',
  'pour le jeu de': 'for the acting of',
  'Pour l\'interprétation de': 'For the performance of',
  'pour l\'interprétation de': 'for the performance of',
  
  // Aspects narratifs
  'Pour le scénario': 'For its screenplay',
  'pour le scénario': 'for its screenplay',
  'Pour l\'histoire': 'For its story',
  'pour l\'histoire': 'for its story',
  'Pour les dialogues': 'For its dialogue',
  'pour les dialogues': 'for its dialogue',
  'Pour le rythme': 'For its pacing',
  'pour le rythme': 'for its pacing',
  'Pour l\'ambiance': 'For its atmosphere',
  'pour l\'ambiance': 'for its atmosphere',
  
  // Termes généraux
  'film d\'auteur': 'auteur film',
  'cinéma d\'auteur': 'auteur cinema',
  'chef-d\'œuvre': 'masterpiece',
  'navet': 'flop',
  'blockbuster': 'blockbuster',
  'perle rare': 'hidden gem',
  'film culte': 'cult film',
};

/**
 * Corrections post-traduction
 * Appliquées après que DeepL ait traduit, pour corriger des erreurs récurrentes
 */
export const POST_TRANSLATION_FIXES = {
  // Corrections de formulations
  'For the realization': 'For its direction',
  'for the realization': 'for its direction',
  'For the photography': 'For its cinematography',
  'for the photography': 'for its cinematography',
  'For the staging': 'For its staging',
  'for the staging': 'for its staging',
  
  // Corrections de termes mal traduits
  'movie': 'film', // Préférer "film" à "movie"
  'Movie': 'Film',
};

/**
 * Applique le glossaire avant la traduction
 * @param {string} text - Texte à pré-traiter
 * @returns {string} Texte avec les termes du glossaire remplacés
 */
export function applyGlossary(text) {
  if (!text) return text;
  
  let processedText = text;
  
  // Appliquer chaque entrée du glossaire
  for (const [french, english] of Object.entries(CINEMA_GLOSSARY)) {
    // Utiliser une regex pour remplacer toutes les occurrences
    const regex = new RegExp(escapeRegex(french), 'g');
    processedText = processedText.replace(regex, english);
  }
  
  return processedText;
}

/**
 * Applique les corrections post-traduction
 * @param {string} text - Texte traduit par DeepL
 * @returns {string} Texte avec les corrections appliquées
 */
export function applyPostTranslationFixes(text) {
  if (!text) return text;
  
  let fixedText = text;
  
  // Appliquer chaque correction
  for (const [wrong, correct] of Object.entries(POST_TRANSLATION_FIXES)) {
    const regex = new RegExp(escapeRegex(wrong), 'g');
    fixedText = fixedText.replace(regex, correct);
  }
  
  return fixedText;
}

/**
 * Échappe les caractères spéciaux pour les regex
 * @param {string} string - Chaîne à échapper
 * @returns {string} Chaîne échappée
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Prépare le texte pour une traduction optimale
 * Ajoute du contexte pour aider DeepL à mieux comprendre
 * @param {string} text - Texte à traduire
 * @param {string} context - Type de contenu ('synopsis', 'why_watch', 'title')
 * @returns {string} Texte préparé
 */
export function prepareTextForTranslation(text, context = 'general') {
  if (!text) return text;
  
  let preparedText = text;
  
  // Appliquer le glossaire
  preparedText = applyGlossary(preparedText);
  
  // Ajouter un préfixe de contexte pour aider DeepL (sera retiré après)
  // Note: DeepL comprend mieux avec du contexte
  switch (context) {
    case 'why_watch':
      // Pour "Pourquoi regarder", on garde tel quel car le glossaire s'applique
      break;
    case 'synopsis':
      // Pour les synopsis, pas besoin de contexte spécial
      break;
    case 'title':
      // Pour les titres, on veut juste le titre original
      break;
  }
  
  return preparedText;
}

/**
 * Traite le texte après traduction DeepL
 * @param {string} text - Texte traduit
 * @returns {string} Texte finalisé
 */
export function postProcessTranslation(text) {
  if (!text) return text;
  
  let processedText = text;
  
  // Appliquer les corrections post-traduction
  processedText = applyPostTranslationFixes(processedText);
  
  return processedText;
}

/**
 * Exemple d'utilisation :
 * 
 * const originalText = "Pour la réalisation exceptionnelle et pour la photographie sublime.";
 * const prepared = prepareTextForTranslation(originalText, 'why_watch');
 * const translated = await translateWithDeepL(prepared);
 * const final = postProcessTranslation(translated, 'why_watch');
 * 
 * Résultat: "For its exceptional direction and for its sublime cinematography."
 */
