'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getStreamingProviders, WATCH_TYPES } from '@/lib/tmdb/streaming';

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
      className="flex flex-col items-center w-16 mr-4 mb-3"
      title={provider.provider_name}
    >
      <div className="relative w-10 h-10 rounded-lg overflow-hidden mx-auto">
        <Image
          src={`/api/image-proxy?url=${encodeURIComponent(`https://image.tmdb.org/t/p/original${provider.logo_path}`)}`}
          alt={provider.provider_name}
          fill
          className="object-cover"
          sizes="40px"
          unoptimized
        />
      </div>
      <span className="text-xs mt-1 text-center break-words line-clamp-2 h-10 overflow-hidden">{provider.provider_name}</span>
    </div>
  );
}

// Composant pour afficher une section de fournisseurs
function ProviderSection({ type, providers }) {
  if (!providers || !providers[type] || providers[type].length === 0) {
    // Si c'est la section FLATRATE (abonnement) qui est vide, on retourne un message spécifique
    if (type === WATCH_TYPES.FLATRATE) {
      return (
        <div className="mb-3">
          <p className="text-gray-500 text-sm py-2">Ce film n'est actuellement disponible sur aucune plateforme de streaming par abonnement en France.</p>
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
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Variable justWatchLink supprimée car plus utilisée

  // Récupérer les plateformes de streaming au chargement du composant
  useEffect(() => {
    let isMounted = true;
    
    async function fetchStreamingProviders() {
      if (!tmdbId) {
        if (isMounted) {
          console.log(`Pas d'ID TMDB fourni pour le film: ${title}`);
          setLoading(false);
        }
        return;
      }
      
      try {
        console.log(`Récupération des plateformes de streaming pour le film avec TMDB ID: ${tmdbId}`);
        const data = await getStreamingProviders(tmdbId);
        
        if (!isMounted) return;
        
        if (data) {
          console.log(`Plateformes trouvées:`, data);
          setProviders(data.providers);
          // setJustWatchLink supprimé car plus utilisé
        } else {
          console.log(`Aucune plateforme trouvée pour le film avec TMDB ID: ${tmdbId}`);
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
      <p className="text-gray-500 text-sm py-2">Ce film n'est actuellement disponible sur aucune plateforme de streaming en France.</p>
    );
  } else {
    content = (
      <div>
        <ProviderSection type={WATCH_TYPES.FLATRATE} providers={providers} />
        <ProviderSection type={WATCH_TYPES.FREE} providers={providers} />
        <ProviderSection type={WATCH_TYPES.ADS} providers={providers} />
        {/* Sections Location et Achat supprimées */}
        {/* Lien vers JustWatch supprimé */}
      </div>
    );
  }
  
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Où regarder en France</h3>
      {content}
    </div>
  );
}
