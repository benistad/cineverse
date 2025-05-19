import Link from 'next/link';
import Image from 'next/image';
import { optimizePosterImage } from '@/lib/utils/imageOptimizer';
import SafeImage from '@/components/ui/SafeImage';

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
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/fall">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <SafeImage 
                      src="https://image.tmdb.org/t/p/w500/9f5sIJEgvUpFv0ozfA6TurG4j22.jpg" 
                      alt="Affiche du film Fall" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Fall (2022)</h3>
                <p className="my-3">
                  Deux amies se retrouvent piégées en haut d&apos;une tour de plus de 600 mètres. Tension maximale, vertige garanti.
                </p>
                <Link href="/films/fall" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🤚 Pour un jeu d'acteur hors du commun :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/split">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-blue-600 flex items-center justify-center text-white p-4 text-center">
                    <div>
                      <div className="text-4xl mb-2">🎬</div>
                      <div className="font-bold">Split</div>
                      <div className="text-sm">(2016)</div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Split (2016)</h3>
                <p className="my-3">
                  James McAvoy incarne un homme aux personnalités multiples dans ce thriller signé M. Night Shyamalan. Sa performance exceptionnelle lui permet d'incarner plus de 20 personnalités différentes avec une précision stupéfiante.
                </p>
                <Link href="/films/split" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎬 Pour une fresque historique spectaculaire :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/1917">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <SafeImage 
                      src="https://image.tmdb.org/t/p/w500/AuGiPiGMYMkSosOJ3BQjDEAiwtO.jpg" 
                      alt="Affiche du film 1917" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 1917 (2019)</h3>
                <p className="my-3">
                  Un chef-d&apos;œuvre de Sam Mendes filmé en un faux plan-séquence. Immersion totale dans les tranchées de la Première Guerre mondiale.
                </p>
                <Link href="/films/1917" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎭 Pour un choc émotionnel et social :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/les-banshees-dinisherin">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-green-600 flex items-center justify-center text-white p-4 text-center">
                    <div>
                      <div className="text-4xl mb-2">🎭</div>
                      <div className="font-bold">Les Banshees d'Inisherin</div>
                      <div className="text-sm">(2022)</div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Les Banshees d&apos;Inisherin (2022)</h3>
                <p className="my-3">
                  Quand une amitié s&apos;effondre sur une île irlandaise, tout bascule. Un drame touchant, étrange et poétique.
                </p>
                <Link href="/films/les-banshees-dinisherin" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🍿 Pour une soirée détente avec un twist :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/game-night">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <SafeImage 
                      src="https://image.tmdb.org/t/p/w500/85R8LMyn9f2Lev2YPBF8Nughrkv.jpg" 
                      alt="Affiche du film Game Night" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Game Night (2018)</h3>
                <p className="my-3">
                  Un jeu entre amis qui tourne à la catastrophe. Drôle, rythmé, surprenant.
                </p>
                <Link href="/films/game-night" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
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
                      <td className="py-2 px-4 border-b font-medium">Science-fiction à la photographie mémorable</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/ad-astra" className="text-blue-600 hover:text-blue-800">Ad Astra</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Thriller psychologique</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/funny-games-us" className="text-blue-600 hover:text-blue-800">Funny Games U.S.</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Histoire vraie incroyable</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/last-breath" className="text-blue-600 hover:text-blue-800">Last Breath</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Film de procès ou politique</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/le-proces-du-siecle" className="text-blue-600 hover:text-blue-800">Le Procès du siècle</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Western Palpitant</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/old-henry" className="text-blue-600 hover:text-blue-800">Old Henry</Link>
                      </td>
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
