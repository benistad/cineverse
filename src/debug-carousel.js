/**
 * Utilitaire de débogage pour le problème de sauvegarde de l'image du carrousel
 * 
 * Ce fichier contient des fonctions pour aider à identifier et résoudre
 * le problème de persistance de l'image du carrousel dans l'interface d'administration.
 */

// Fonction pour enregistrer l'état de l'image du carrousel
export function logCarouselImageState(filmId, action, data) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    filmId,
    action,
    data
  };
  
  // Récupérer les logs existants
  const existingLogs = JSON.parse(localStorage.getItem('carousel_debug_logs') || '[]');
  
  // Ajouter le nouveau log
  existingLogs.push(logEntry);
  
  // Limiter le nombre de logs stockés (garder les 100 derniers)
  if (existingLogs.length > 100) {
    existingLogs.shift();
  }
  
  // Sauvegarder les logs
  localStorage.setItem('carousel_debug_logs', JSON.stringify(existingLogs));
  
  // Afficher dans la console pour un débogage immédiat
  console.log(`[CAROUSEL DEBUG] ${action} - Film ID: ${filmId}`, data);
}

// Fonction pour sauvegarder l'état de l'image du carrousel dans le localStorage
export function saveCarouselImageState(filmId, imagePath, imageUrl) {
  // Sauvegarder les données dans le localStorage
  localStorage.setItem(`carousel_image_${filmId}_path`, imagePath);
  localStorage.setItem(`carousel_image_${filmId}_url`, imageUrl);
  
  // Enregistrer l'action pour le débogage
  logCarouselImageState(filmId, 'SAVE_STATE', { imagePath, imageUrl });
}

// Fonction pour récupérer l'état de l'image du carrousel depuis le localStorage
export function getCarouselImageState(filmId) {
  const imagePath = localStorage.getItem(`carousel_image_${filmId}_path`);
  const imageUrl = localStorage.getItem(`carousel_image_${filmId}_url`);
  
  // Enregistrer l'action pour le débogage
  logCarouselImageState(filmId, 'GET_STATE', { imagePath, imageUrl });
  
  return { imagePath, imageUrl };
}

// Fonction pour afficher tous les logs de débogage
export function displayCarouselDebugLogs() {
  const logs = JSON.parse(localStorage.getItem('carousel_debug_logs') || '[]');
  console.log('=== CAROUSEL DEBUG LOGS ===');
  logs.forEach((log, index) => {
    console.log(`${index + 1}. [${log.timestamp}] ${log.action} - Film ID: ${log.filmId}`, log.data);
  });
  console.log('=== END OF LOGS ===');
  return logs;
}

// Fonction pour effacer tous les logs de débogage
export function clearCarouselDebugLogs() {
  localStorage.removeItem('carousel_debug_logs');
  console.log('Logs de débogage du carrousel effacés');
}
