'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/search/SearchResults';
import SeoHeading from '@/components/ui/SeoHeading';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <SeoHeading level={1} className="text-3xl font-bold mb-6">Résultats de recherche</SeoHeading>
        <SearchResults searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="bg-white rounded-lg shadow-lg p-6 mb-6"><SeoHeading level={1} className="text-3xl font-bold mb-6">Chargement des résultats...</SeoHeading><div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div></div></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
