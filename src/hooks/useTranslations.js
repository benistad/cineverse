'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

// Import des messages de traduction
import frMessages from '../../messages/fr.json';
import enMessages from '../../messages/en.json';

const messages = {
  fr: frMessages,
  en: enMessages
};

/**
 * Hook pour accéder aux traductions de l'interface
 * @returns {Function} Fonction t pour traduire les clés
 */
export function useTranslations() {
  const { locale } = useLanguage();
  const [currentMessages, setCurrentMessages] = useState(messages[locale] || messages.fr);

  useEffect(() => {
    console.log('useTranslations - Locale changée vers:', locale);
    console.log('Messages disponibles:', Object.keys(messages));
    console.log('Messages chargés pour', locale, ':', messages[locale] ? 'OK' : 'MANQUANT');
    setCurrentMessages(messages[locale] || messages.fr);
  }, [locale]);

  /**
   * Fonction de traduction
   * @param {string} key - Clé de traduction (ex: "nav.blog", "home.title")
   * @param {Object} params - Paramètres à interpoler dans la traduction
   * @returns {string} Texte traduit
   */
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = currentMessages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // Interpolation des paramètres
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value;
  };

  return { t, locale };
}
