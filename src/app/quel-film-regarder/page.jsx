import Link from 'next/link';
import Image from 'next/image';

export default function QuelFilmRegarder() {
  // Schéma JSON-LD pour les moteurs de recherche - format FAQ pour un meilleur positionnement
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quel film regarder ce soir ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Découvrez notre sélection des meilleurs films à voir ce soir : Fall (2022) pour un film haletant, Split (2016) pour un scénario brillant, 1917 (2019) pour une fresque historique, Les Banshees d'Inisherin (2022) pour un drame touchant, et Game Night (2018) pour une soirée détente."
        }
      },
      {
        "@type": "Question",
        "name": "Quels sont les meilleurs films à voir en 2025 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour une expérience cinématographique optimale en 2025, nous recommandons des films comme Interstellar pour la science-fiction, Knock at the Cabin pour un thriller psychologique, et The Beekeeper pour l'action. Consultez notre guide complet pour plus de suggestions selon votre humeur."
        }
      }
    ]
  };

  return (
    <div className="bg-gray-50">
      {/* Script JSON-LD pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4" id="quel-film-regarder">🎬 Quel film regarder ce soir ? Top 10 des films à voir absolument</h1>
            <div className="flex justify-center">
              <span className="inline-block w-32 h-1 rounded bg-blue-500 mb-4"></span>
            </div>
          </header>
        
          <div className="mb-8">
            <p className="text-lg">
              <strong>Vous ne savez pas quel film regarder ce soir ?</strong> Vous n&apos;êtes pas seul. C&apos;est LA question que tout cinéphile se pose régulièrement.
              Heureusement, <strong>MovieHunt.fr</strong> est là pour vous guider avec des films notés, analysés et choisis avec soin, pour vous faire passer un excellent moment, que vous ayez envie d&apos;un thriller, d&apos;un drame poignant ou d&apos;une aventure spectaculaire.
            </p>
            
            <p className="text-xl font-semibold text-center my-6">
              Voici nos recommandations du moment 👇
            </p>
          </div>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🔥 Pour un film haletant et intense :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-xl font-semibold">🎥 Fall (2022)</h3>
              <p className="my-3">
                Deux amies se retrouvent piégées en haut d&apos;une tour de plus de 600 mètres. Tension maximale, vertige garanti.
              </p>
              <Link href="/films/fall" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                👉 Voir la fiche sur MovieHunt
              </Link>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🧠 Pour un scénario brillant et perturbant :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-xl font-semibold">🎥 Split (2016)</h3>
              <p className="my-3">
                James McAvoy incarne un homme aux personnalités multiples dans ce thriller signé M. Night Shyamalan.
              </p>
              <Link href="/films/split" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                👉 Voir la fiche sur MovieHunt
              </Link>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎬 Pour une fresque historique spectaculaire :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-xl font-semibold">🎥 1917 (2019)</h3>
              <p className="my-3">
                Un chef-d&apos;œuvre de Sam Mendes filmé en un faux plan-séquence. Immersion totale dans les tranchées de la Première Guerre mondiale.
              </p>
              <Link href="/films/1917" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                👉 Voir la fiche sur MovieHunt
              </Link>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎭 Pour un choc émotionnel et social :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-xl font-semibold">🎥 Les Banshees d&apos;Inisherin (2022)</h3>
              <p className="my-3">
                Quand une amitié s&apos;effondre sur une île irlandaise, tout bascule. Un drame touchant, étrange et poétique.
              </p>
              <Link href="/films/les-banshees-d-inisherin" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                👉 Voir la fiche sur MovieHunt
              </Link>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🍿 Pour une soirée détente avec un twist :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-xl font-semibold">🎥 Game Night (2018)</h3>
              <p className="my-3">
                Un jeu entre amis qui tourne à la catastrophe. Drôle, rythmé, surprenant.
              </p>
              <Link href="/films/game-night" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                👉 Voir la fiche sur MovieHunt
              </Link>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Autres suggestions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎞️ Vous ne savez toujours pas quel film regarder ?</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-xl font-semibold mb-4">Voici d&apos;autres suggestions selon votre humeur :</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="py-2 px-4 border-b text-left">Humeur / Envie</th>
                      <th className="py-2 px-4 border-b text-left">Film à découvrir</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Science-fiction prenante</td>
                      <td className="py-2 px-4 border-b">Interstellar, Ad Astra, Tenet</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Thriller psychologique</td>
                      <td className="py-2 px-4 border-b">Knock at the Cabin, Vivarium, Funny Games U.S.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Histoire vraie inspirante</td>
                      <td className="py-2 px-4 border-b">Le Fondateur, Oppenheimer, Escape from Pretoria</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Film de procès ou politique</td>
                      <td className="py-2 px-4 border-b">L&apos;Étau de Munich, Le Procès du siècle</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Action explosive</td>
                      <td className="py-2 px-4 border-b">The Beekeeper, Mad Max, Old Henry, RRR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          
          {/* Confiance MovieHunt */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">📽️ Et si vous faisiez confiance à la note MovieHunt ?</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <p className="mb-4">
                Chaque film sur MovieHunt.fr est noté sur 10 et accompagné d&apos;une recommandation claire.
              </p>
              <ul className="list-none pl-0">
                <li className="mb-2 flex items-start">
                  <span className="mr-2">👉</span> Si le film vaut le détour, on vous dit pourquoi.
                </li>
                <li className="mb-2 flex items-start">
                  <span className="mr-2">👉</span> S&apos;il peut être évité, on vous l&apos;indique aussi.
                </li>
              </ul>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Pourquoi suivre MovieHunt */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">✅ Pourquoi suivre MovieHunt ?</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <ul className="list-none pl-0">
                <li className="mb-2 flex items-start">
                  <span className="mr-2">•</span> Des critiques sincères et personnelles
                </li>
                <li className="mb-2 flex items-start">
                  <span className="mr-2">•</span> Des pépites que vous ne verrez pas partout
                </li>
                <li className="mb-2 flex items-start">
                  <span className="mr-2">•</span> Une interface simple et sans pub
                </li>
                <li className="mb-2 flex items-start">
                  <span className="mr-2">•</span> Des mises à jour régulières
                </li>
              </ul>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Conclusion */}
          <section className="mb-8 text-center">
            <p className="text-xl font-semibold">
              📌 Ajoutez MovieHunt.fr à vos favoris et revenez quand vous hésitez sur quel film regarder.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
