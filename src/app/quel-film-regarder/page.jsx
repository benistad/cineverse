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
          "text": "Découvrez notre sélection personnalisée des meilleurs films à voir ce soir : Fall (2022) pour un film haletant, Split (2016) pour un jeu d'acteur hors du commun, 1917 (2019) pour une fresque historique, Les Banshees d'Inisherin (2022) pour un drame touchant, et Game Night (2018) pour une soirée détente."
        }
      },
      {
        "@type": "Question",
        "name": "Comment trouver un bon film à regarder ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour trouver un bon film à regarder, consultez les recommandations personnalisées de MovieHunt qui propose des films triés sur le volet selon différentes catégories : films à voir ce soir, idées de films pour une soirée en couple, recommandations de films par genre, ou encore des pépites méconnues notées et analysées par nos experts."
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
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4" id="quel-film-regarder">🎬 Quel film regarder ce soir ?</h1>
            <div className="flex justify-center">
              <span className="inline-block w-32 h-1 rounded bg-blue-500 mb-4"></span>
            </div>
          </header>
        
          <div className="mb-8">
            <p className="text-lg">
              <strong>Vous ne savez pas quel film regarder ce soir ?</strong> Vous n&apos;êtes pas seul. C&apos;est LA question que tout cinéphile se pose régulièrement. En panne d&apos;inspiration pour trouver un film à voir, vous êtes au bon endroit !
            </p>
            
            <p className="text-lg">
              Heureusement, <strong>MovieHunt.fr</strong> est là pour vous aider à décider quel film regarder avec des recommandations personnalisées. Nos films sont notés, analysés et choisis avec soin, pour vous faire passer un excellent moment, que vous cherchiez des idées de films à regarder en couple, entre amis ou en solo.
            </p>
            
            <h2 className="text-2xl font-bold mt-6 mb-4">Notre sélection personnalisée</h2>
            
            <p className="text-lg mb-4">
              Vous cherchez quoi regarder ce soir ? Voici notre sélection de films triés sur le volet pour vous aider à trouver le film parfait pour votre soirée :
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
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <SafeImage 
                      src="https://image.tmdb.org/t/p/w780/lli31lYTFpvxVBeFHWoe5PMfW5s.jpg" 
                      alt="Affiche du film Split" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                      priority
                    />
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
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <SafeImage 
                      src="https://image.tmdb.org/t/p/w500/5Y0AINkH7xDqmuxJXUQdPbtyrub.jpg" 
                      alt="Affiche du film Les Banshees d'Inisherin" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
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
          
          {/* Comment nous choisissons nos films */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">📽️ Comment nous choisissons nos films</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <p className="mb-4">
                Vous vous demandez <strong>quel film regarder</strong> parmi les milliers disponibles ? Notre équipe de passionnés de cinéma analyse chaque semaine les sorties pour vous proposer des <strong>recommandations de films</strong> personnalisées.
              </p>
              <p className="mb-4">
                Chaque film sur MovieHunt.fr est noté sur 10 et accompagné d&apos;une recommandation claire pour vous aider à décider quoi voir ce soir :
              </p>
              <ul className="list-none pl-0">
                <li className="mb-2 flex items-start">
                  <span className="mr-2">👉</span> <strong>Films à voir absolument</strong> : nous vous expliquons pourquoi ces films méritent votre temps.
                </li>
                <li className="mb-2 flex items-start">
                  <span className="mr-2">👉</span> <strong>Films à éviter</strong> : nous vous épargnons des déceptions en vous indiquant les films qui ne valent pas le coup.
                </li>
                <li className="mb-2 flex items-start">
                  <span className="mr-2">👉</span> <strong>Pépites méconnues</strong> : nous dénichons des films exceptionnels que vous auriez pu manquer.
                </li>
              </ul>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Pourquoi faire confiance à MovieHunt */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">✅ Pourquoi faire confiance à MovieHunt</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
              <p className="mb-4">
                Quand vous cherchez <strong>des idées de films à regarder</strong>, MovieHunt se distingue par :
              </p>
              <ul className="list-none pl-0">
                <li className="mb-3 flex items-start">
                  <span className="mr-2">•</span> <strong>Des critiques sincères et personnelles</strong> : nous ne sommes pas influencés par les studios ou les distributeurs.
                </li>
                <li className="mb-3 flex items-start">
                  <span className="mr-2">•</span> <strong>Une sélection de films à voir</strong> qui sort des sentiers battus, avec des pépites que vous ne verrez pas partout.
                </li>
                <li className="mb-3 flex items-start">
                  <span className="mr-2">•</span> <strong>Des recommandations personnalisées</strong> selon vos goûts et vos envies du moment.
                </li>
                <li className="mb-3 flex items-start">
                  <span className="mr-2">•</span> <strong>Des mises à jour hebdomadaires</strong> pour toujours vous proposer de nouvelles idées de films à voir.
                </li>
              </ul>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Conclusion */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Ne plus jamais se demander quel film regarder</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="mb-4">
                Plus besoin de passer des heures à chercher <strong>quoi regarder ce soir</strong> ! MovieHunt est votre guide cinématographique personnel qui vous propose chaque semaine de nouvelles <strong>idées de films à regarder</strong>, adaptées à vos goûts et à vos envies.
              </p>
              
              <p className="mb-4">
                Que vous cherchiez des <strong>films à voir en couple</strong>, des <strong>recommandations de films</strong> pour une soirée entre amis, ou simplement <strong>trouver un bon film</strong> pour vous détendre, notre sélection personnalisée saura vous inspirer.
              </p>
              
              <p className="text-center text-xl font-semibold mt-6">
                📌 Ajoutez MovieHunt.fr à vos favoris et revenez chaque fois que vous vous demandez <strong>quel film regarder ce soir</strong>.
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
