import Link from 'next/link';

export const metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site MovieHunt.fr : éditeur, hébergement, propriété intellectuelle et conditions d\'utilisation.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/mentions-legales',
  },
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Mentions légales</h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Éditeur du site</h2>
          <p className="text-gray-700">
            Le site <strong>MovieHunt</strong> (accessible à l'adresse <a href="https://www.moviehunt.fr" className="text-indigo-600 hover:underline">www.moviehunt.fr</a>) est un site personnel édité par MovieHunt.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Nom du site :</strong> MovieHunt</li>
            <li><strong>URL :</strong> https://www.moviehunt.fr</li>
            <li><strong>Contact :</strong> <Link href="/contact" className="text-indigo-600 hover:underline">Formulaire de contact</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Hébergement</h2>
          <p className="text-gray-700">Le site est hébergé par :</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Hébergeur :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">vercel.com</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Propriété intellectuelle</h2>
          <p className="text-gray-700">
            L'ensemble du contenu éditorial (critiques, avis, textes) publié sur MovieHunt est la propriété de l'éditeur du site, sauf mention contraire.
          </p>
          <p className="text-gray-700">
            Les affiches de films, images et données cinématographiques proviennent de l'API <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">The Movie Database (TMDB)</a>. 
            Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB. Les droits sur ces contenus appartiennent à leurs propriétaires respectifs.
          </p>
          <p className="text-gray-700">
            Toute reproduction, distribution ou utilisation du contenu éditorial sans autorisation préalable est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Responsabilité</h2>
          <p className="text-gray-700">
            Les critiques et notes publiées sur MovieHunt reflètent l'opinion personnelle de l'équipe éditoriale. 
            MovieHunt s'efforce de fournir des informations exactes mais ne peut garantir l'exhaustivité ou l'exactitude de toutes les données affichées (dates de sortie, disponibilité streaming, etc.).
          </p>
          <p className="text-gray-700">
            MovieHunt ne saurait être tenu responsable des contenus accessibles via les liens externes présents sur le site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Données personnelles</h2>
          <p className="text-gray-700">
            Pour en savoir plus sur la collecte et le traitement de vos données personnelles, consultez notre{' '}
            <Link href="/politique-de-confidentialite" className="text-indigo-600 hover:underline">
              Politique de confidentialité
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Cookies</h2>
          <p className="text-gray-700">
            Le site utilise des cookies techniques nécessaires à son bon fonctionnement (préférences de langue, authentification). 
            Aucun cookie publicitaire ou de tracking tiers n'est utilisé. 
            L'outil d'analyse utilisé (<a href="https://withcabin.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Cabin Analytics</a>) est respectueux de la vie privée et ne dépose aucun cookie.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Crédits</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Données films :</strong> <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">The Movie Database (TMDB)</a></li>
            <li><strong>Framework :</strong> Next.js</li>
            <li><strong>Hébergement :</strong> Vercel</li>
            <li><strong>Base de données :</strong> Supabase</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="text-indigo-600 hover:underline font-medium">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
