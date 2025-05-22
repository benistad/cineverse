'use client';

import Link from 'next/link';
import { FiHome, FiFilm, FiSearch, FiAward, FiHelpCircle, FiList } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MovieHunt</h3>
            <p className="text-gray-400 text-sm">
              Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. 
              Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes 
              de streaming françaises et encore plus.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white flex items-center">
                  <FiHome className="mr-2" /> Accueil
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white flex items-center">
                  <FiSearch className="mr-2" /> Recherche
                </Link>
              </li>
              <li>
                <Link href="/all-films" className="text-gray-400 hover:text-white flex items-center">
                  <FiFilm className="mr-2" /> Tous les films
                </Link>
              </li>
              <li>
                <Link href="/films-index" className="text-gray-400 hover:text-white flex items-center">
                  <FiList className="mr-2" /> Index des films
                </Link>
              </li>
              <li>
                <Link href="/quel-film-regarder" className="text-gray-400 hover:text-white flex items-center">
                  <FiHelpCircle className="mr-2" /> Quel film regarder ?
                </Link>
              </li>
              <li>
                <Link href="/huntedbymoviehunt" className="text-gray-400 hover:text-white flex items-center">
                  <FiAward className="mr-2" /> Hunted by MovieHunt
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/films-index" className="text-gray-400 hover:text-white">
                  Index complet des films
                </Link>
              </li>
              <li>
                <Link href="/all-films" className="text-gray-400 hover:text-white">
                  Catalogue de films
                </Link>
              </li>
              <li>
                <Link href="/quel-film-regarder" className="text-gray-400 hover:text-white">
                  Recommandations de films
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} MovieHunt. Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0">
            <Link href="/annuaires" className="text-gray-400 hover:text-white text-sm">
              Partenaires
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
