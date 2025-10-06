'use client';

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
          "text": "Découvrez notre sélection de pépites méconnues à voir ce soir : Greedy People (2024) pour une comédie noire surprenante, Old Henry (2021) pour un western avec un twist inattendu, Tetris (2023) pour une histoire vraie fascinante, Dom Hemingway (2013) pour une performance d'acteur mémorable, et Irresistible (2020) pour une comédie politique intelligente. Notre liste de films conseillés est mise à jour chaque semaine."
        }
      },
      {
        "@type": "Question",
        "name": "Comment trouver un bon film à regarder ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour trouver un bon film à regarder, consultez les recommandations de films personnalisées de MovieHunt qui propose des films triés sur le volet selon différentes catégories : films à voir ce soir, idées de films à voir pour une soirée en couple, recommandations de films par genre, ou encore des pépites méconnues notées et analysées par nos experts. Chaque film est accompagné d'une critique sincère et d'une note sur 10."
        }
      },
      {
        "@type": "Question",
        "name": "Quels sont les meilleurs films méconnus à voir en 2025 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour découvrir des pépites méconnues en 2025, nous recommandons Greedy People pour une comédie noire avec Joseph Gordon-Levitt, Old Henry pour un western surprenant avec Tim Blake Nelson, Tetris pour l'histoire vraie fascinante du jeu vidéo avec Taron Egerton, Dom Hemingway pour une performance explosive de Jude Law, et Irresistible pour une satire politique brillante. Consultez notre guide complet pour plus d'idées de films à regarder selon votre humeur."
        }
      },
      {
        "@type": "Question",
        "name": "Où trouver des idées de films à regarder ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MovieHunt.fr est votre destination pour trouver des idées de films à regarder. Nous proposons une sélection de films à voir triée sur le volet, avec des recommandations personnalisées selon vos envies : films haletants, drames touchants, comédies rythmées, ou pépites méconnues. Chaque film est noté, analysé et accompagné d'une critique détaillée pour vous aider à décider quoi regarder ce soir."
        }
      },
      {
        "@type": "Question",
        "name": "Comment MovieHunt choisit ses recommandations de films ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MovieHunt sélectionne ses recommandations de films grâce à une équipe de passionnés de cinéma qui analyse chaque semaine les sorties et les pépites méconnues. Chaque film à regarder est noté sur 10 avec une critique sincère et personnelle, sans influence des studios ou distributeurs. Nous mettons en avant les films à voir absolument, signalons les films à éviter, et dénichons des pépites exceptionnelles que vous auriez pu manquer."
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
        
          {/* Bloc de mise à jour */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-sm text-blue-800 font-medium">
              🆕 <strong>Dernière mise à jour : octobre 2025</strong>
            </p>
          </div>

          <div className="mb-8">
            <p className="text-lg">
              <strong>Vous ne savez pas quel film regarder ce soir ?</strong> Vous n&apos;êtes pas seul. C&apos;est LA question que tout cinéphile se pose régulièrement. En panne d&apos;inspiration pour trouver un film à voir, vous êtes au bon endroit !
            </p>
            
            <p className="text-lg">
              Heureusement, <strong>MovieHunt.fr</strong> est là pour vous aider à décider quel film regarder avec des <strong>recommandations de films</strong> personnalisées. Nos films sont notés, analysés et choisis avec soin, pour vous faire passer un excellent moment, que vous cherchiez des <strong>idées de films à voir</strong> en couple, entre amis ou en solo.
            </p>
            
            <p className="text-lg">
              Vous trouverez ici une <strong>liste de films conseillés</strong>, qu&apos;il s&apos;agisse d&apos;un thriller, d&apos;un drame ou d&apos;une comédie. Notre objectif : vous aider à <strong>trouver un bon film à regarder</strong> sans passer des heures à chercher.
            </p>
            
            {/* Section Halloween */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-900 mb-3">🎃 Spécial Halloween 2025</h3>
              <p className="text-gray-800 mb-3">
                Vous cherchez des <strong>films d&apos;horreur pour Halloween</strong> ? Découvrez notre sélection de 10 films terrifiants parfaits pour une soirée frissons !
              </p>
              <Link href="/films-horreur-halloween-2025" className="inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold">
                👻 Voir notre sélection Halloween 2025 →
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold mt-6 mb-4">Notre sélection personnalisée</h2>
            
            <p className="text-lg mb-4">
              Vous cherchez <strong>quoi regarder ce soir</strong> ? Voici notre sélection de films triés sur le volet pour vous aider à trouver le <strong>film à regarder</strong> parfait pour votre soirée :
            </p>
          </div>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎭 Pour une comédie noire surprenante :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/greedy-people">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/qkmFPxiawqjGhxuC3HvN9sVuJbD.jpg" 
                      alt="Affiche du film Greedy People" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                      onError={(e) => {
                        if (e.target.src.includes('/w342/')) {
                          e.target.src = e.target.src.replace('/w342/', '/w185/');
                        } else {
                          e.target.src = '/images/placeholder.jpg';
                        }
                      }}
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Greedy People (2024)</h3>
                <p className="my-3">
                  Un meurtre, un million de dollars, et une série de décisions catastrophiques dans une petite ville paisible. Joseph Gordon-Levitt brille dans cette comédie noire pleine de rebondissements.
                </p>
                <Link href="/films/greedy-people" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🤠 Pour un western avec un twist inattendu :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/old-henry">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/eE1SL0QoDsvAMqQly56IkRtlN1W.jpg" 
                      alt="Affiche du film Old Henry" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src.includes('/w342/')) {
                          e.target.src = e.target.src.replace('/w342/', '/w185/');
                        } else {
                          e.target.src = '/images/placeholder.jpg';
                        }
                      }}
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Old Henry (2021)</h3>
                <p className="my-3">
                  Un fermier veuf accueille un homme blessé avec une sacoche pleine d&apos;argent. Ce western intimiste cache un secret qui va tout changer. Tim Blake Nelson est magistral dans ce film qui revisite le genre avec intelligence.
                </p>
                <Link href="/films/old-henry" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎮 Pour une histoire vraie fascinante :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/tetris">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/obdw3SyT4TnCQIWHndOX7NQsdpj.jpg" 
                      alt="Affiche du film Tetris" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src.includes('/w342/')) {
                          e.target.src = e.target.src.replace('/w342/', '/w185/');
                        } else {
                          e.target.src = '/images/placeholder.jpg';
                        }
                      }}
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Tetris (2023)</h3>
                <p className="my-3">
                  L&apos;incroyable histoire vraie derrière le jeu vidéo le plus populaire au monde. Un thriller haletant sur fond de Guerre froide avec Taron Egerton, entre espionnage et négociations impossibles en URSS.
                </p>
                <Link href="/films/tetris" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎬 Pour une performance d'acteur mémorable :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/dom-hemingway">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/QQqo4TybGj5WpJvqVdkpJdoqWk.jpg" 
                      alt="Affiche du film Dom Hemingway" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src.includes('/w342/')) {
                          e.target.src = e.target.src.replace('/w342/', '/w185/');
                        } else {
                          e.target.src = '/images/placeholder.jpg';
                        }
                      }}
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Dom Hemingway (2013)</h3>
                <p className="my-3">
                  Après 12 ans de prison, un perceur de coffres-forts légendaire revient à Londres pour récupérer son dû. Jude Law est explosif dans cette comédie noire britannique décalée et savoureuse.
                </p>
                <Link href="/films/dom-hemingway" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  👉 Voir la fiche sur MovieHunt
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🗳️ Pour une comédie politique intelligente :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/irresistible">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/vhN1GXEQFnmypQ6tqJfZS5DuIJh.jpg" 
                      alt="Affiche du film Irresistible" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src.includes('/w342/')) {
                          e.target.src = e.target.src.replace('/w342/', '/w185/');
                        } else {
                          e.target.src = '/images/placeholder.jpg';
                        }
                      }}
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Irresistible (2020)</h3>
                <p className="my-3">
                  Un consultant politique démocrate aide un colonel à la retraite dans une élection locale. Une satire mordante du système électoral américain avec un twist final brillant qui change tout.
                </p>
                <Link href="/films/irresistible" className="inline-flex items-center text-blue-600 hover:text-blue-800">
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
                Chaque film sur MovieHunt.fr est noté sur 10 et accompagné d&apos;une recommandation claire pour vous aider à décider quoi voir ce soir. Tous les films de cette sélection sont notés et analysés dans notre <Link href="/all-films" className="text-blue-600 hover:text-blue-800 font-semibold">catalogue complet</Link>, avec le badge <Link href="/huntedbymoviehunt" className="text-blue-600 hover:text-blue-800 font-semibold">Hunted by MovieHunt</Link> pour les plus marquants.
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
                <li className="mb-3">
                  <span className="mr-2">•</span>
                  <strong>Des critiques sincères et personnelles</strong> : nous ne sommes pas influencés par les studios ou les distributeurs.{' '}
                  <Link href="/comment-nous-travaillons" className="text-blue-600 hover:text-blue-800">Découvrez comment nous travaillons</Link>.
                </li>
                <li className="mb-3">
                  <span className="mr-2">•</span>
                  <strong>Une sélection de films à voir</strong> qui sort des sentiers battus, avec des pépites que vous ne verrez pas partout.
                </li>
                <li className="mb-3">
                  <span className="mr-2">•</span>
                  <strong>Des recommandations personnalisées</strong> selon vos goûts et vos envies du moment.
                </li>
                <li className="mb-3">
                  <span className="mr-2">•</span>
                  <strong>Des mises à jour hebdomadaires</strong> pour toujours vous proposer de nouvelles idées de films à voir.
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
                Que vous cherchiez des <strong>films à voir en couple</strong>, des <strong>recommandations de films</strong> pour une soirée entre amis, ou simplement <strong>trouver un bon film</strong> pour vous détendre, notre <strong>liste de films conseillés</strong> saura vous inspirer.
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
