/**
 * Utilitaire de cache côté serveur pour les requêtes API
 * Implémente un cache en mémoire avec invalidation temporelle
 */

// Cache en mémoire avec structure Map
const memoryCache = new Map();

// Configuration par défaut
const DEFAULT_TTL = 60 * 60 * 1000; // 1 heure en millisecondes
const DEFAULT_STALE_WHILE_REVALIDATE = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

/**
 * Génère une clé de cache unique basée sur l'URL et les paramètres
 * @param {string} url - URL de la requête
 * @param {Object} params - Paramètres de la requête
 * @returns {string} - Clé de cache unique
 */
function generateCacheKey(url, params = {}) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${url}${sortedParams ? `?${sortedParams}` : ''}`;
}

/**
 * Récupère une valeur du cache
 * @param {string} key - Clé de cache
 * @returns {Object|null} - Valeur mise en cache ou null si non trouvée/expirée
 */
function getCachedValue(key) {
  if (!memoryCache.has(key)) {
    return null;
  }
  
  const { value, expiry, staleUntil } = memoryCache.get(key);
  const now = Date.now();
  
  // Si la valeur n'est pas expirée, la retourner
  if (now < expiry) {
    return { value, fresh: true };
  }
  
  // Si la valeur est périmée mais toujours utilisable (stale-while-revalidate)
  if (now < staleUntil) {
    return { value, fresh: false };
  }
  
  // Supprimer la valeur périmée
  memoryCache.delete(key);
  return null;
}

/**
 * Met en cache une valeur
 * @param {string} key - Clé de cache
 * @param {any} value - Valeur à mettre en cache
 * @param {number} ttl - Durée de vie en millisecondes
 * @param {number} staleWhileRevalidate - Durée pendant laquelle la valeur périmée peut être utilisée
 */
function setCachedValue(key, value, ttl = DEFAULT_TTL, staleWhileRevalidate = DEFAULT_STALE_WHILE_REVALIDATE) {
  const now = Date.now();
  const expiry = now + ttl;
  const staleUntil = expiry + staleWhileRevalidate;
  
  memoryCache.set(key, {
    value,
    expiry,
    staleUntil,
    cachedAt: now
  });
}

/**
 * Récupère des données avec mise en cache
 * @param {string} url - URL à récupérer
 * @param {Object} options - Options de la requête fetch
 * @param {Object} cacheOptions - Options de mise en cache
 * @returns {Promise<any>} - Données récupérées
 */
export async function fetchWithCache(url, options = {}, cacheOptions = {}) {
  const {
    ttl = DEFAULT_TTL,
    staleWhileRevalidate = DEFAULT_STALE_WHILE_REVALIDATE,
    bypassCache = false,
    params = {}
  } = cacheOptions;
  
  // Générer la clé de cache
  const cacheKey = generateCacheKey(url, params);
  
  // Si le cache n'est pas contourné, vérifier s'il y a une valeur en cache
  if (!bypassCache) {
    const cachedData = getCachedValue(cacheKey);
    
    if (cachedData) {
      // Si les données sont fraîches, les retourner immédiatement
      if (cachedData.fresh) {
        return cachedData.value;
      }
      
      // Si les données sont périmées mais utilisables, les retourner et déclencher une revalidation en arrière-plan
      revalidateInBackground(url, options, cacheKey, ttl, staleWhileRevalidate);
      return cachedData.value;
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
    setCachedValue(cacheKey, data, ttl, staleWhileRevalidate);
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données: ${error.message}`);
    throw error;
  }
}

/**
 * Revalide les données en arrière-plan sans bloquer
 * @param {string} url - URL à récupérer
 * @param {Object} options - Options de la requête fetch
 * @param {string} cacheKey - Clé de cache
 * @param {number} ttl - Durée de vie en millisecondes
 * @param {number} staleWhileRevalidate - Durée pendant laquelle la valeur périmée peut être utilisée
 */
async function revalidateInBackground(url, options, cacheKey, ttl, staleWhileRevalidate) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      return;
    }
    
    const data = await response.json();
    
    // Mettre à jour le cache avec les nouvelles données
    setCachedValue(cacheKey, data, ttl, staleWhileRevalidate);
  } catch (error) {
    console.error(`Erreur lors de la revalidation en arrière-plan: ${error.message}`);
  }
}

/**
 * Invalide une entrée de cache spécifique
 * @param {string} url - URL à invalider
 * @param {Object} params - Paramètres de la requête
 */
export function invalidateCache(url, params = {}) {
  const cacheKey = generateCacheKey(url, params);
  memoryCache.delete(cacheKey);
}

/**
 * Invalide toutes les entrées de cache qui commencent par un préfixe donné
 * @param {string} urlPrefix - Préfixe d'URL à invalider
 */
export function invalidateCacheByPrefix(urlPrefix) {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(urlPrefix)) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Vide complètement le cache
 */
export function clearCache() {
  memoryCache.clear();
}

/**
 * Récupère des statistiques sur le cache
 * @returns {Object} - Statistiques du cache
 */
export function getCacheStats() {
  const now = Date.now();
  let totalEntries = 0;
  let freshEntries = 0;
  let staleEntries = 0;
  let expiredEntries = 0;
  
  for (const [key, { expiry, staleUntil }] of memoryCache.entries()) {
    totalEntries++;
    
    if (now < expiry) {
      freshEntries++;
    } else if (now < staleUntil) {
      staleEntries++;
    } else {
      expiredEntries++;
      // Supprimer les entrées expirées
      memoryCache.delete(key);
    }
  }
  
  return {
    totalEntries: totalEntries - expiredEntries, // Ne pas compter les entrées qui viennent d'être supprimées
    freshEntries,
    staleEntries,
    cacheSize: memoryCache.size
  };
}
