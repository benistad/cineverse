'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function CabinAnalytics() {
  const pathname = usePathname();
  
  // Ne pas charger Cabin Analytics sur les pages admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <Script
      src="https://scripts.withcabin.com/hello.js"
      strategy="afterInteractive"
      async
    />
  );
}
