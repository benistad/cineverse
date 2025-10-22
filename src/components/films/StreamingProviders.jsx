'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getStreamingProviders, WATCH_TYPES } from '@/lib/tmdb/streaming';
import { optimizeLogoImage } from '@/lib/utils/imageOptimizer';
import { useTranslations } from '@/hooks/useTranslations';

// Mapping des codes pays vers les noms de pays
const COUNTRY_NAMES = {
  fr: { fr: 'France', en: 'France' },
  us: { fr: 'États-Unis', en: 'United States' },
  gb: { fr: 'Royaume-Uni', en: 'United Kingdom' },
  ca: { fr: 'Canada', en: 'Canada' },
  de: { fr: 'Allemagne', en: 'Germany' },
  es: { fr: 'Espagne', en: 'Spain' },
  it: { fr: 'Italie', en: 'Italy' },
  be: { fr: 'Belgique', en: 'Belgium' },
  ch: { fr: 'Suisse', en: 'Switzerland' }
};

// Fonction utilitaire pour obtenir le texte du type de disponibilité
function getWatchTypeText(type) {
  switch (type) {
    case WATCH_TYPES.FLATRATE:
      return ''; // Suppression du mot "Abonnement"
    case WATCH_TYPES.RENT:
      return 'Location'; // Sera masqué
    case WATCH_TYPES.BUY:
      return 'Achat'; // Sera masqué
    case WATCH_TYPES.ADS:
      return 'Gratuit avec pub';
    case WATCH_TYPES.FREE:
      return 'Gratuit';
    default:
      return '';
  }
}

// Composant pour afficher un fournisseur de streaming
function ProviderItem({ provider }) {
  return (
    <div 
      className="flex flex-col items-center w-20 mr-3 mb-3"
      title={provider.provider_name}
    >
      <div className="relative w-12 h-12 rounded-lg overflow-hidden mx-auto mb-1">
        <Image
          src={`/api/image-proxy?url=${encodeURIComponent(optimizeLogoImage(`https://image.tmdb.org/t/p/original${provider.logo_path}`))}`}
          alt={`Logo ${provider.provider_name} - Disponible en streaming`}
          fill
          className="object-contain"
          sizes="48px"
        />
      </div>
      <span className="text-xs text-center break-words leading-tight">{provider.provider_name}</span>
    </div>
  );
}

// Composant pour afficher une section de fournisseurs
function ProviderSection({ type, providers, t, locale, userCountry }) {
  if (!providers || !providers[type] || providers[type].length === 0) {
    // Si c'est la section FLATRATE (abonnement) qui est vide, on retourne un message spécifique
    if (type === WATCH_TYPES.FLATRATE) {
      return (
        <div className="mb-3">
          <p className="text-gray-500 text-sm py-2">{t('film.noStreamingAvailable', { country: COUNTRY_NAMES[userCountry.toLowerCase()]?.[locale] || userCountry })}</p>
        </div>
      );
    }
    return null;
  }
  
  return (
    <div className="mb-3">
      <h4 className="text-sm font-medium text-gray-600 mb-1">{getWatchTypeText(type)}</h4>
      <div className="flex flex-wrap justify-start">
        {providers[type].map((provider) => (
          <ProviderItem key={provider.provider_id} provider={provider} />
        ))}
      </div>
    </div>
  );
}

/**
 * Composant qui affiche les plateformes de streaming où un film est disponible en France
 * @param {Object} props - Propriétés du composant
 * @param {number} props.tmdbId - ID TMDB du film
 * @param {string} props.title - Titre du film (utilisé comme fallback si tmdbId n'est pas disponible)
 * @param {number} props.year - Année de sortie du film (utilisé comme fallback si tmdbId n'est pas disponible)
 */
export default function StreamingProviders({ tmdbId, title, year }) {
  const { t, locale } = useTranslations();
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCountry, setUserCountry] = useState('FR');
  // Variable justWatchLink supprimée car plus utilisée

  // Détecter le pays du visiteur
  useEffect(() => {
    async function detectCountry() {
      try {
        // Utiliser l'API de géolocalisation du navigateur ou une API externe
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          setUserCountry(data.country_code);
        }
      } catch (error) {
        console.log('Could not detect country, defaulting to FR');
        setUserCountry('FR');
      }
    }
    detectCountry();
  }, []);

  // Récupérer les plateformes de streaming au chargement du composant
  useEffect(() => {
    let isMounted = true;
    
    async function fetchStreamingProviders() {
      if (!tmdbId) {
        if (isMounted) {
          
          setLoading(false);
        }
        return;
      }
      
      try {
        
        const data = await getStreamingProviders(tmdbId, userCountry);
        
        if (!isMounted) return;
        
        if (data) {
          
          setProviders(data.providers);
          // setJustWatchLink supprimé car plus utilisé
        } else {
          
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des plateformes de streaming:', err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchStreamingProviders();
    
    return () => {
      isMounted = false;
    };
  }, [tmdbId, title, year]);
  
  // Rendu du contenu
  let content;
  
  if (loading) {
    content = (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  } else if (error) {
    content = (
      <p className="text-red-500 text-sm">Impossible de récupérer les plateformes de streaming.</p>
    );
  } else if (!providers || !Object.values(providers).some(arr => arr && arr.length > 0)) {
    content = (
      <p className="text-gray-500 text-sm py-2">{t('film.noStreamingAvailable', { country: COUNTRY_NAMES[userCountry.toLowerCase()]?.[locale] || userCountry })}</p>
    );
  } else {
    content = (
      <div>
        <ProviderSection type={WATCH_TYPES.FLATRATE} providers={providers} t={t} locale={locale} userCountry={userCountry} />
        <ProviderSection type={WATCH_TYPES.FREE} providers={providers} t={t} locale={locale} userCountry={userCountry} />
        <ProviderSection type={WATCH_TYPES.ADS} providers={providers} t={t} locale={locale} userCountry={userCountry} />
        {/* Sections Location et Achat supprimées */}
        {/* Lien vers JustWatch supprimé */}
      </div>
    );
  }
  
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">{t('film.whereToWatchIn', { country: COUNTRY_NAMES[userCountry.toLowerCase()]?.[locale] || userCountry })}</h3>
      {content}
    </div>
  );
}
