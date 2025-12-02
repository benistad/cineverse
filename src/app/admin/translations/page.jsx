'use client';

// MULTILINGUAL DISABLED - This page redirects to dashboard
// Original code saved in page.jsx.backup for future use

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TranslationsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <p className="text-gray-600">Redirection vers le dashboard...</p>
      </div>
    </div>
  );
}
