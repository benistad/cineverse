'use client';

import { useEffect, useState } from 'react';

/**
 * Composant qui enregistre et gère le Service Worker
 * Ce composant ne rend rien visuellement mais configure le Service Worker pour le cache hors ligne
 */
export default function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  useEffect(() => {
    // Vérifier si le navigateur prend en charge les Service Workers
    if ('serviceWorker' in navigator) {
      // Attendre que la page soit complètement chargée
      window.addEventListener('load', () => {
        registerServiceWorker();
      });
    }
    
    // Fonction pour enregistrer le Service Worker
    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        console.log('Service Worker enregistré avec succès:', registration.scope);
        
        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Une nouvelle version est disponible
              setUpdateAvailable(true);
              
              // Afficher une notification à l'utilisateur
              showUpdateNotification();
            }
          });
        });
        
        // Vérifier s'il y a déjà un Service Worker actif
        if (registration.active) {
          console.log('Service Worker actif:', registration.active);
        }
        
        // Gérer les mises à jour du Service Worker
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker mis à jour');
        });
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      }
    }
    
    // Fonction pour afficher une notification de mise à jour
    function showUpdateNotification() {
      // Créer un élément de notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center justify-between">
          <p class="mr-4">Une nouvelle version est disponible. Rafraîchissez pour mettre à jour.</p>
          <button class="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors">
            Rafraîchir
          </button>
        </div>
      `;
      
      // Ajouter la notification au DOM
      document.body.appendChild(notification);
      
      // Ajouter un gestionnaire d'événements pour le bouton de rafraîchissement
      const refreshButton = notification.querySelector('button');
      refreshButton.addEventListener('click', () => {
        // Envoyer un message au Service Worker pour qu'il s'active immédiatement
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Rafraîchir la page
        window.location.reload();
      });
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Rien à nettoyer pour l'instant
    };
  }, []);
  
  // Ce composant ne rend rien
  return null;
}
