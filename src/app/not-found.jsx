import Link from 'next/link';
import { FiHome, FiSearch } from 'react-icons/fi';

export const metadata = {
  title: 'Page non trouvée | MovieHunt',
  description: 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FiHome /> Retour à l&apos;accueil
          </Link>
          <Link 
            href="/search" 
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors"
          >
            <FiSearch /> Rechercher un film
          </Link>
        </div>
      </div>
    </div>
  );
}
