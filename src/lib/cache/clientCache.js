/**
 * Cache côté client utilisant sessionStorage pour améliorer le TTI
 * Les données sont conservées pendant la session du navigateur
 */

const CACHE_VERSION = 'v2_'; // Incrémenter pour forcer le rechargement du cache
const CACHE_PREFIX = 'moviehunt_' + CACHE_VERSION;

export const clientCache = {
  /**
   * Stocker des données dans le cache avec un TTL
   */
  set: (key, data, ttl = 300000) => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = {
        data,
        expiry: Date.now() + ttl,
        timestamp: Date.now()
      };
      sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Erreur lors de la mise en cache:', error);
      if (error.name === 'QuotaExceededError') {
        clientCache.clear();
      }
    }
  },
  
  /**
   * Récupérer des données du cache
   */
  get: (key) => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = sessionStorage.getItem(CACHE_PREFIX + key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      if (Date.now() > parsed.expiry) {
        sessionStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Erreur lors de la lecture du cache:', error);
      return null;
    }
  },
  
  /**
   * Supprimer une entrée du cache
   */
  remove: (key) => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Erreur lors de la suppression du cache:', error);
    }
  },
  
  /**
   * Nettoyer tout le cache MovieHunt
   */
  clear: () => {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Erreur lors du nettoyage du cache:', error);
    }
  },
  
  /**
   * Vérifier si une clé existe dans le cache
   */
  has: (key) => {
    return clientCache.get(key) !== null;
  }
};
