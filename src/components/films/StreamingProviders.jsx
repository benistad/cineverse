'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getStreamingProviders, WATCH_TYPES } from '@/lib/tmdb/streaming';

/**
 * Composant qui affiche les plateformes de streaming où un film est disponible en France
 * @param {Object} props - Propriétés du composant
 * @param {number} props.tmdbId - ID TMDB du film
 * @param {string} props.title - Titre du film (utilisé comme fallback si tmdbId n'est pas disponible)
 * @param {number} props.year - Année de sortie du film (utilisé comme fallback si tmdbId n'est pas disponible)
 */
export default function StreamingProviders({ tmdbId, title, year }) {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justWatchLink, setJustWatchLink] = useState(null);

  // Récupérer les plateformes de streaming au chargement du composant
  useEffect(() => {
    async function fetchStreamingProviders() {
      try {
        setLoading(true);
        
        if (tmdbId) {
          console.log(`Récupération des plateformes de streaming pour le film avec TMDB ID: ${tmdbId}`);
          const data = await getStreamingProviders(tmdbId);
          
          if (data) {
            console.log(`Plateformes trouvées:`, data);
            setProviders(data.providers);
            setJustWatchLink(data.link);
          } else {
            console.log(`Aucune plateforme trouvée pour le film avec TMDB ID: ${tmdbId}`);
          }
        } else {
          console.log(`Pas d'ID TMDB fourni pour le film: ${title}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des plateformes de streaming:', err);
        setError(err);
        setLoading(false);
      }
    }
    
    if (tmdbId) {
      fetchStreamingProviders();
    } else {
      setLoading(false);
    }
  }, [tmdbId, title, year]);
  
  // Fonction pour rendre une section de plateformes
  const renderProviderSection = (type) => {
    if (!providers || !providers[type] || providers[type].length === 0) {
      return null;
    }
    
    return (
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-600 mb-1">{getWatchTypeText(type)}</h4>
        <div className="flex flex-wrap gap-2">
          {providers[type].map((provider) => (
            <div 
              key={provider.provider_id} 
              className="flex flex-col items-center"
              title={provider.provider_name}
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src={`/api/image-proxy?url=${encodeURIComponent(`https://image.tmdb.org/t/p/original${provider.logo_path}`)}`}
                  alt={provider.provider_name}
                  fill
                  className="object-cover"
                  sizes="40px"
                  unoptimized
                />
              </div>
              <span className="text-xs mt-1 text-center">{provider.provider_name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Préparer le contenu à afficher
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
    // Afficher un message informatif lorsqu'aucune plateforme n'est disponible
    console.log(`Aucune plateforme de streaming disponible pour ce film`);
    content = (
      <p className="text-gray-500 text-sm py-2">Ce film n'est actuellement disponible sur aucune plateforme de streaming en France.</p>
    );
  } else {
    content = (
      <div>
        {renderProviderSection(WATCH_TYPES.FLATRATE)}
        {renderProviderSection(WATCH_TYPES.FREE)}
        {renderProviderSection(WATCH_TYPES.ADS)}
        {renderProviderSection(WATCH_TYPES.RENT)}
        {renderProviderSection(WATCH_TYPES.BUY)}
        
        {justWatchLink && (
          <div className="mt-3 text-right">
            <a 
              href={justWatchLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Plus d'informations sur JustWatch
            </a>
          </div>
        )}
      </div>
    );
  }
  
  // Fonction pour obtenir le texte du type de disponibilité
  const getWatchTypeText = (type) => {
    switch (type) {
      case WATCH_TYPES.FLATRATE:
        return 'Abonnement';
      case WATCH_TYPES.RENT:
        return 'Location';
      case WATCH_TYPES.BUY:
        return 'Achat';
      case WATCH_TYPES.ADS:
        return 'Gratuit avec pub';
      case WATCH_TYPES.FREE:
        return 'Gratuit';
      default:
        return '';
    }
  };
  
  // Toujours afficher le composant, même si aucune plateforme n'est disponible
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Où regarder en France</h3>
      {content}
    </div>
  );
}
