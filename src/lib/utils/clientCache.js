/**
 * Utilitaire de cache côté client pour les requêtes API
 * Implémente un cache local avec localStorage/sessionStorage
 */

// Configuration par défaut
const DEFAULT_TTL = 60 * 60 * 1000; // 1 heure en millisecondes
const CACHE_PREFIX = 'cineverse_cache_';

/**
 * Vérifie si le stockage est disponible
 * @param {string} type - Type de stockage ('localStorage' ou 'sessionStorage')
 * @returns {boolean} - True si le stockage est disponible
 */
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Génère une clé de cache unique
 * @param {string} key - Clé de base
 * @returns {string} - Clé préfixée
 */
function generateCacheKey(key) {
  return `${CACHE_PREFIX}${key}`;
}

/**
 * Récupère une valeur du cache
 * @param {string} key - Clé de cache
 * @param {string} storageType - Type de stockage ('localStorage' ou 'sessionStorage')
 * @returns {Object|null} - Valeur mise en cache ou null si non trouvée/expirée
 */
export function getFromCache(key, storageType = 'localStorage') {
  // Vérifier si le stockage est disponible
  if (typeof window === 'undefined' || !isStorageAvailable(storageType)) {
    return null;
  }
  
  const storage = window[storageType];
  const cacheKey = generateCacheKey(key);
  
  try {
    const cachedItem = storage.getItem(cacheKey);
    
    if (!cachedItem) {
      return null;
    }
    
    const { value, expiry } = JSON.parse(cachedItem);
    const now = Date.now();
    
    // Vérifier si la valeur a expiré
    if (now > expiry) {
      // Supprimer l'élément expiré
      storage.removeItem(cacheKey);
      return null;
    }
    
    return value;
  } catch (error) {
    console.error(`Erreur lors de la récupération du cache pour ${key}:`, error);
    return null;
  }
}

/**
 * Met en cache une valeur
 * @param {string} key - Clé de cache
 * @param {any} value - Valeur à mettre en cache
 * @param {number} ttl - Durée de vie en millisecondes
 * @param {string} storageType - Type de stockage ('localStorage' ou 'sessionStorage')
 * @returns {boolean} - True si la mise en cache a réussi
 */
export function setInCache(key, value, ttl = DEFAULT_TTL, storageType = 'localStorage') {
  // Vérifier si le stockage est disponible
  if (typeof window === 'undefined' || !isStorageAvailable(storageType)) {
    return false;
  }
  
  const storage = window[storageType];
  const cacheKey = generateCacheKey(key);
  const now = Date.now();
  const expiry = now + ttl;
  
  try {
    const item = {
      value,
      expiry,
      cachedAt: now
    };
    
    storage.setItem(cacheKey, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise en cache pour ${key}:`, error);
    
    // En cas d'erreur de quota, nettoyer le cache
    if (error instanceof DOMException && (
      error.code === 22 || // Chrome
      error.code === 1014 || // Firefox
      error.name === 'QuotaExceededError' || // Safari
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' // Firefox
    )) {
      clearCacheByAge(30 * 24 * 60 * 60 * 1000, storageType); // Nettoyer les éléments de plus de 30 jours
    }
    
    return false;
  }
}

/**
 * Récupère des données avec mise en cache
 * @param {string} url - URL à récupérer
 * @param {Object} options - Options de la requête fetch
 * @param {Object} cacheOptions - Options de mise en cache
 * @returns {Promise<any>} - Données récupérées
 */
export async function fetchWithClientCache(url, options = {}, cacheOptions = {}) {
  const {
    ttl = DEFAULT_TTL,
    bypassCache = false,
    storageType = 'localStorage',
    cacheKey = url,
  } = cacheOptions;
  
  // Si le cache n'est pas contourné, vérifier s'il y a une valeur en cache
  if (!bypassCache) {
    const cachedData = getFromCache(cacheKey, storageType);
    
    if (cachedData) {
      return cachedData;
    }
  }
  
  // Aucune donnée en cache ou cache contourné, effectuer la requête
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Mettre en cache les données
    setInCache(cacheKey, data, ttl, storageType);
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données: ${error.message}`);
    throw error;
  }
}

/**
 * Invalide une entrée de cache spécifique
 * @param {string} key - Clé à invalider
 * @param {string} storageType - Type de stockage ('localStorage' ou 'sessionStorage')
 */
export function invalidateClientCache(key, storageType = 'localStorage') {
  if (typeof window === 'undefined' || !isStorageAvailable(storageType)) {
    return;
  }
  
  const storage = window[storageType];
  const cacheKey = generateCacheKey(key);
  
  storage.removeItem(cacheKey);
}

/**
 * Invalide toutes les entrées de cache qui commencent par un préfixe donné
 * @param {string} prefix - Préfixe des clés à invalider
 * @param {string} storageType - Type de stockage ('localStorage' ou 'sessionStorage')
 */
export function invalidateClientCacheByPrefix(prefix, storageType = 'localStorage') {
  if (typeof window === 'undefined' || !isStorageAvailable(storageType)) {
    return;
  }
  
  const storage = window[storageType];
  const fullPrefix = generateCacheKey(prefix);
  
  // Parcourir toutes les clés du stockage
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    
    if (key && key.startsWith(fullPrefix)) {
      storage.removeItem(key);
    }
  }
}

/**
 * Nettoie le cache en supprimant les entrées plus anciennes qu'un certain âge
 * @param {number} maxAge - Âge maximum en millisecondes
 * @param {string} storageType - Type de stockage ('localStorage' ou 'sessionStorage')
 */
export function clearCacheByAge(maxAge, storageType = 'localStorage') {
  if (typeof window === 'undefined' || !isStorageAvailable(storageType)) {
    return;
  }
  
  const storage = window[storageType];
  const now = Date.now();
  const keysToRemove = [];
  
  // Identifier les clés à supprimer
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    
    if (key && key.startsWith(CACHE_PREFIX)) {
      try {
        const item = JSON.parse(storage.getItem(key));
        
        if (item && item.cachedAt && (now - item.cachedAt > maxAge)) {
          keysToRemove.push(key);
        }
      } catch (_) {
        // Ignorer les erreurs de parsing
      }
    }
  }
  
  // Supprimer les clés identifiées
  keysToRemove.forEach(key => storage.removeItem(key));
  
  return keysToRemove.length;
}

/**
 * Vide complètement le cache
 * @param {string} storageType - Type de stockage ('localStorage' ou 'sessionStorage')
 */
export function clearAllClientCache(storageType = 'localStorage') {
  if (typeof window === 'undefined' || !isStorageAvailable(storageType)) {
    return;
  }
  
  const storage = window[storageType];
  const keysToRemove = [];
  
  // Identifier les clés à supprimer
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    
    if (key && key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  // Supprimer les clés identifiées
  keysToRemove.forEach(key => storage.removeItem(key));
  
  return keysToRemove.length;
}

/**
 * Initialise le nettoyage automatique du cache
 * @param {number} interval - Intervalle de nettoyage en millisecondes
 * @param {number} maxAge - Âge maximum des entrées en millisecondes
 */
export function initCacheCleanup(interval = 24 * 60 * 60 * 1000, maxAge = 7 * 24 * 60 * 60 * 1000) {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Nettoyer le cache au démarrage
  clearCacheByAge(maxAge);
  
  // Configurer le nettoyage périodique
  const intervalId = setInterval(() => {
    clearCacheByAge(maxAge);
  }, interval);
  
  // Retourner une fonction pour arrêter le nettoyage
  return () => clearInterval(intervalId);
}
