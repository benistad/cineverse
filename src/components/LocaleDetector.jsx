'use client';

// MULTILINGUAL DISABLED - Always set French locale
import { useEffect } from 'react';

export default function LocaleDetector() {
  useEffect(() => {
    // Always set French locale
    document.cookie = `NEXT_LOCALE=fr; path=/; max-age=${365 * 24 * 60 * 60}`;
  }, []);

  return null;
}
