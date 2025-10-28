'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Composant pour mettre à jour dynamiquement l'attribut lang du HTML
 * Important pour le SEO et l'accessibilité
 */
export default function HtmlLangAttribute() {
  const { locale } = useLanguage();

  useEffect(() => {
    // Mettre à jour l'attribut lang de la balise html
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
