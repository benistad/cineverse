import Link from 'next/link';

export const metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité de MovieHunt.fr : collecte de données, cookies, newsletter et vos droits.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/politique-de-confidentialite',
  },
  robots: { index: true, follow: true },
};

export default function PolitiqueDeConfidentialite() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>

      <p className="text-gray-600 mb-8">Dernière mise à jour : février 2026</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
          <p className="text-gray-700">
            MovieHunt (accessible à l'adresse <a href="https://www.moviehunt.fr" className="text-indigo-600 hover:underline">www.moviehunt.fr</a>) s'engage à protéger la vie privée de ses utilisateurs. 
            Cette politique de confidentialité décrit les données que nous collectons, comment nous les utilisons et vos droits.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Données collectées</h2>
          
          <h3 className="text-xl font-medium text-gray-800 mb-2">2.1 Newsletter</h3>
          <p className="text-gray-700">
            Si vous vous inscrivez à notre newsletter, nous collectons votre <strong>adresse email</strong> et éventuellement votre <strong>prénom</strong>. 
            Ces données sont utilisées uniquement pour vous envoyer nos recommandations de films. 
            Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque email.
          </p>

          <h3 className="text-xl font-medium text-gray-800 mb-2 mt-4">2.2 Formulaire de contact</h3>
          <p className="text-gray-700">
            Lorsque vous utilisez notre formulaire de contact, nous collectons votre <strong>nom</strong>, <strong>adresse email</strong> et le <strong>contenu de votre message</strong>. 
            Ces données sont utilisées uniquement pour répondre à votre demande.
          </p>

          <h3 className="text-xl font-medium text-gray-800 mb-2 mt-4">2.3 Données de navigation</h3>
          <p className="text-gray-700">
            Nous utilisons <a href="https://withcabin.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Cabin Analytics</a>, un outil d'analyse respectueux de la vie privée. 
            Cabin ne dépose aucun cookie, ne collecte aucune donnée personnelle identifiable et est conforme au RGPD. 
            Seules des données agrégées et anonymes sont collectées (nombre de visites, pages consultées).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Cookies</h2>
          <p className="text-gray-700">
            MovieHunt utilise uniquement des <strong>cookies techniques</strong> nécessaires au bon fonctionnement du site :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Préférence de langue</strong> : mémorise votre choix de langue (cookie NEXT_LOCALE)</li>
            <li><strong>Authentification</strong> : cookies de session pour l'espace administrateur</li>
          </ul>
          <p className="text-gray-700 mt-2">
            <strong>Aucun cookie publicitaire, de tracking ou de profilage n'est utilisé.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Stockage des données</h2>
          <p className="text-gray-700">
            Les données de la newsletter sont stockées dans notre base de données hébergée par{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Supabase</a> (serveurs en Europe). 
            Les emails sont envoyés via{' '}
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Resend</a>.
          </p>
          <p className="text-gray-700">
            Nous ne vendons, ne louons et ne partageons jamais vos données personnelles avec des tiers à des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Vos droits (RGPD)</h2>
          <p className="text-gray-700">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Pour exercer ces droits, contactez-nous via notre{' '}
            <Link href="/contact" className="text-indigo-600 hover:underline">formulaire de contact</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Newsletter et désinscription</h2>
          <p className="text-gray-700">
            Chaque email de notre newsletter contient un <strong>lien de désinscription</strong> en bas de page. 
            En cliquant dessus, votre adresse email sera immédiatement marquée comme désinscrite et vous ne recevrez plus d'emails de notre part.
          </p>
          <p className="text-gray-700">
            Vous pouvez également demander la suppression complète de votre adresse email de notre base de données via le{' '}
            <Link href="/contact" className="text-indigo-600 hover:underline">formulaire de contact</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Modifications</h2>
          <p className="text-gray-700">
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
            Les modifications seront publiées sur cette page avec une date de mise à jour.
          </p>
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
