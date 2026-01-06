import Link from 'next/link';

/**
 * Composant de maillage interne pour améliorer le SEO
 * Affiche des liens vers des pages connexes
 */

// Liens par défaut vers les pages principales
const DEFAULT_LINKS = [
  { href: '/top-rated', title: 'Films les mieux notés', description: 'Notre sélection des meilleurs films' },
  { href: '/films-inconnus', title: 'Pépites méconnues', description: 'Des films à découvrir absolument' },
  { href: '/quel-film-regarder', title: 'Quel film regarder ?', description: 'Guide pour choisir votre film' },
  { href: '/genres', title: 'Par genre', description: 'Action, Comédie, Drame, Horreur...' },
  { href: '/annees', title: 'Par année', description: 'Films classés par année de sortie' },
];

// Liens vers les genres populaires
const GENRE_LINKS = [
  { href: '/genre/action', title: 'Action' },
  { href: '/genre/comedie', title: 'Comédie' },
  { href: '/genre/drame', title: 'Drame' },
  { href: '/genre/horreur', title: 'Horreur' },
  { href: '/genre/thriller', title: 'Thriller' },
  { href: '/genre/science-fiction', title: 'Science-Fiction' },
];

// Liens vers les années récentes
const YEAR_LINKS = [
  { href: '/annee/2025', title: '2025' },
  { href: '/annee/2024', title: '2024' },
  { href: '/annee/2023', title: '2023' },
  { href: '/annee/2022', title: '2022' },
];

/**
 * Section de liens internes en grille
 */
export function InternalLinksGrid({ 
  title = 'Découvrez plus de films',
  links = DEFAULT_LINKS,
  className = ''
}) {
  return (
    <section className={`p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg ${className}`}>
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">{title}</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {links.map((link) => (
          <Link 
            key={link.href}
            href={link.href} 
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-800">{link.title}</h3>
            {link.description && (
              <p className="text-sm text-gray-600">{link.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Barre de liens genres en ligne
 */
export function GenreLinksBar({ currentGenre = null, className = '' }) {
  return (
    <nav className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Explorer par genre</h2>
      <div className="flex flex-wrap gap-2">
        {GENRE_LINKS.filter(g => g.href !== `/genre/${currentGenre}`).map((genre) => (
          <Link
            key={genre.href}
            href={genre.href}
            className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
          >
            {genre.title}
          </Link>
        ))}
        <Link
          href="/genres"
          className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors"
        >
          Tous les genres →
        </Link>
      </div>
    </nav>
  );
}

/**
 * Barre de liens années en ligne
 */
export function YearLinksBar({ currentYear = null, className = '' }) {
  return (
    <nav className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Films par année</h2>
      <div className="flex flex-wrap gap-2">
        {YEAR_LINKS.filter(y => y.href !== `/annee/${currentYear}`).map((year) => (
          <Link
            key={year.href}
            href={year.href}
            className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
          >
            {year.title}
          </Link>
        ))}
        <Link
          href="/annees"
          className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors"
        >
          Toutes les années →
        </Link>
      </div>
    </nav>
  );
}

/**
 * Section complète de maillage interne pour les pages films
 */
export function FilmInternalLinks({ film, className = '' }) {
  const year = film.release_date ? new Date(film.release_date).getFullYear() : null;
  const genre = film.genres ? film.genres.split(',')[0].trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-') : null;

  return (
    <section className={`space-y-4 ${className}`}>
      {/* Liens contextuels basés sur le film */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Films similaires</h2>
        <div className="flex flex-wrap gap-2">
          {year && (
            <Link
              href={`/annee/${year}`}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              Autres films de {year}
            </Link>
          )}
          {genre && (
            <Link
              href={`/genre/${genre}`}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              Plus de {film.genres.split(',')[0].trim()}
            </Link>
          )}
          <Link
            href="/top-rated"
            className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            Films les mieux notés
          </Link>
          <Link
            href="/films-inconnus"
            className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            Pépites méconnues
          </Link>
        </div>
      </div>
    </section>
  );
}

export default InternalLinksGrid;
