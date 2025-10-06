'use client';

/**
 * Système de cache pour les requêtes Supabase
 * Réduit le nombre de requêtes et améliore les performances
 */

class SupabaseCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    // Durée de validité du cache en millisecondes
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Génère une clé de cache unique basée sur la fonction et ses paramètres
   */
  generateKey(functionName, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    return `${functionName}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Récupère une valeur du cache si elle est encore valide
   */
  get(key) {
    const timestamp = this.timestamps.get(key);
    const now = Date.now();

    // Vérifier si le cache existe et est encore valide
    if (timestamp && now - timestamp < this.defaultTTL) {
      const cachedData = this.cache.get(key);
      if (cachedData) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Cache HIT] ${key}`);
        }
        return cachedData;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache MISS] ${key}`);
    }
    return null;
  }

  /**
   * Stocke une valeur dans le cache
   */
  set(key, value) {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache SET] ${key}`);
    }
  }

  /**
   * Invalide une entrée spécifique du cache
   */
  invalidate(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache INVALIDATE] ${key}`);
    }
  }

  /**
   * Invalide toutes les entrées correspondant à un pattern
   */
  invalidatePattern(pattern) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.invalidate(key));
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache INVALIDATE PATTERN] ${pattern} (${keysToDelete.length} entries)`);
    }
  }

  /**
   * Vide complètement le cache
   */
  clear() {
    this.cache.clear();
    this.timestamps.clear();
    if (process.env.NODE_ENV === 'development') {
      console.log('[Cache CLEAR] All cache cleared');
    }
  }

  /**
   * Retourne les statistiques du cache
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Instance singleton du cache
const supabaseCacheInstance = new SupabaseCache();

/**
 * Wrapper pour exécuter une fonction avec cache
 * @param {string} functionName - Nom de la fonction pour la clé de cache
 * @param {object} params - Paramètres de la fonction
 * @param {function} fetchFunction - Fonction asynchrone à exécuter si pas de cache
 * @returns {Promise} - Résultat de la fonction (depuis le cache ou fraîchement récupéré)
 */
export async function withCache(functionName, params, fetchFunction) {
  const cacheKey = supabaseCacheInstance.generateKey(functionName, params);
  
  // Essayer de récupérer depuis le cache
  const cachedResult = supabaseCacheInstance.get(cacheKey);
  if (cachedResult !== null) {
    return cachedResult;
  }

  // Si pas de cache, exécuter la fonction
  try {
    const result = await fetchFunction();
    // Stocker le résultat dans le cache
    supabaseCacheInstance.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`[Cache ERROR] ${functionName}:`, error);
    throw error;
  }
}

/**
 * Invalide le cache pour un type de données spécifique
 */
export function invalidateCache(pattern) {
  supabaseCacheInstance.invalidatePattern(pattern);
}

/**
 * Vide complètement le cache
 */
export function clearCache() {
  supabaseCacheInstance.clear();
}

/**
 * Récupère les statistiques du cache
 */
export function getCacheStats() {
  return supabaseCacheInstance.getStats();
}

export default supabaseCacheInstance;
