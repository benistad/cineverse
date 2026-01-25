'use client';

import Link from 'next/link';
import Image from 'next/image';
import { optimizePosterImage } from '@/lib/utils/imageOptimizer';
import SafeImage from '@/components/ui/SafeImage';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuelFilmRegarder() {
  const { t } = useTranslations();
  const { locale } = useLanguage();
  
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
          "text": "Découvrez notre sélection de pépites inconnues à voir ce soir : Greedy People (2024) pour une comédie noire surprenante, Old Henry (2021) pour un western avec un twist inattendu, Tetris (2023) pour une histoire vraie fascinante, Dom Hemingway (2013) pour une performance d'acteur mémorable, et Irresistible (2020) pour une comédie politique intelligente. Notre liste de films conseillés est mise à jour chaque semaine."
        }
      },
      {
        "@type": "Question",
        "name": "Comment trouver un bon film à regarder ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour trouver un bon film à regarder, consultez les recommandations de films personnalisées de MovieHunt qui propose des films triés sur le volet selon différentes catégories : films à voir ce soir, idées de films à voir pour une soirée en couple, recommandations de films par genre, ou encore des pépites inconnues notées et analysées par nos experts. Chaque film est accompagné d'une critique sincère et d'une note sur 10."
        }
      },
      {
        "@type": "Question",
        "name": "Quels sont les meilleurs films inconnus à voir en 2025 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour découvrir des pépites inconnues en 2025, nous recommandons Greedy People pour une comédie noire avec Joseph Gordon-Levitt, Old Henry pour un western surprenant avec Tim Blake Nelson, Tetris pour l'histoire vraie fascinante du jeu vidéo avec Taron Egerton, Dom Hemingway pour une performance explosive de Jude Law, et Irresistible pour une satire politique brillante. Consultez notre guide complet pour plus d'idées de films à regarder selon votre humeur."
        }
      },
      {
        "@type": "Question",
        "name": "Où trouver des idées de films à regarder ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MovieHunt.fr est votre destination pour trouver des idées de films à regarder. Nous proposons une sélection de films à voir triée sur le volet, avec des recommandations personnalisées selon vos envies : films haletants, drames touchants, comédies rythmées, ou pépites inconnues. Chaque film est noté, analysé et accompagné d'une critique détaillée pour vous aider à décider quoi regarder ce soir."
        }
      },
      {
        "@type": "Question",
        "name": "Comment MovieHunt choisit ses recommandations de films ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MovieHunt sélectionne ses recommandations de films grâce à une équipe de passionnés de cinéma qui analyse chaque semaine les sorties et les pépites inconnues. Chaque film à regarder est noté sur 10 avec une critique sincère et personnelle, sans influence des studios ou distributeurs. Nous mettons en avant les films à voir absolument, signalons les films à éviter, et dénichons des pépites exceptionnelles que vous auriez pu manquer."
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
      
      <div className="container mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-800" id="quel-film-regarder">{t('whatToWatch.title')}</h1>
            <div className="flex justify-center">
              <span className="inline-block w-32 h-1 rounded bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"></span>
            </div>
          </header>
        
          {/* Bloc de mise à jour */}
          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-6 rounded">
            <p className="text-sm text-indigo-800 font-medium">
              <strong>{t('whatToWatch.lastUpdate')}</strong>
            </p>
          </div>

          <div className="mb-8">
            <p className="text-lg">
              {t('whatToWatch.intro1')}
            </p>
            
            <p className="text-lg">
              {t('whatToWatch.intro2')}
            </p>
            
            <p className="text-lg">
              {t('whatToWatch.intro3')}
            </p>
            
            <h2 className="text-2xl font-bold mt-6 mb-4">{t('whatToWatch.personalizedSelection')}</h2>
            
            <p className="text-lg mb-4">
              {t('whatToWatch.selectionIntro')}
            </p>
          </div>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">⚖️ Pour un drame historique captivant :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/nuremberg">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/6iYLH0TjqCyEkCYadpLUMHr9S8J.jpg" 
                      alt="Affiche du film Nuremberg" 
                      width="342"
                      height="513"
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
                <h3 className="text-xl font-semibold">🎥 Nuremberg (2025)</h3>
                <p className="my-3">
                  Le procès historique des criminels nazis vu à travers les yeux d'un psychiatre chargé d'évaluer Hermann Göring. Un duel psychologique fascinant entre le médecin et le pervers narcissique qu'était le Reichsmarschall.
                </p>
                <Link href="/films/nuremberg" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  {t('whatToWatch.seeOnMovieHunt')}
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">👽 Pour une comédie SF délirante :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/bugonia">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/btKcDyCzPZO06OpySaAOcMFQKyA.jpg" 
                      alt="Affiche du film Bugonia" 
                      width="342"
                      height="513"
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
                <h3 className="text-xl font-semibold">🎥 Bugonia (2025)</h3>
                <p className="my-3">
                  Deux complotistes kidnappent une PDG qu'ils croient être une extraterrestre venue détruire la Terre. Une comédie SF complètement barrée avec Emma Stone, entre absurde et satire sociale.
                </p>
                <Link href="/films/bugonia" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  {t('whatToWatch.seeOnMovieHunt')}
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🔥 Pour un drame touchant :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/rebuilding">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/b6cV7mSg93sDFX4NKVbVjJUXdUF.jpg" 
                      alt="Affiche du film Rebuilding" 
                      width="342"
                      height="513"
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
                <h3 className="text-xl font-semibold">🎥 Rebuilding (2025)</h3>
                <p className="my-3">
                  Après avoir tout perdu dans les incendies de l'Ouest américain, un homme tente de reconstruire sa vie dans un camp de fortune. Un drame intimiste sur la résilience et l'espoir de renouer avec sa famille.
                </p>
                <Link href="/films/rebuilding" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  {t('whatToWatch.seeOnMovieHunt')}
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">😱 Pour un thriller horrifique glaçant :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/longlegs">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/ncTqrUeLNZee3WtKSX5lJBZDkUf.jpg" 
                      alt="Affiche du film Longlegs" 
                      width="342"
                      height="513"
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
                <h3 className="text-xl font-semibold">🎥 Longlegs (2024)</h3>
                <p className="my-3">
                  Une agent du FBI traque un tueur en série insaisissable aux frontières de l'occulte. Nicolas Cage livre une performance terrifiante dans ce thriller horrifique à l'atmosphère oppressante.
                </p>
                <Link href="/films/longlegs" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  {t('whatToWatch.seeOnMovieHunt')}
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommandation 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🔫 Pour un thriller haletant :</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/last-stop-yuma-county">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/hleK8EXJxuRdPlhbmfI8n7n2K1B.jpg" 
                      alt="Affiche du film Last Stop Yuma County" 
                      width="342"
                      height="513"
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
                <h3 className="text-xl font-semibold">🎥 Last Stop : Yuma County (2024)</h3>
                <p className="my-3">
                  Dans un diner perdu en Arizona, des clients attendent l'arrivée d'essence quand deux braqueurs en cavale débarquent. Un huis clos tendu et maîtrisé qui monte crescendo jusqu'à un final explosif.
                </p>
                <Link href="/films/last-stop-yuma-county" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  {t('whatToWatch.seeOnMovieHunt')}
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
                    <tr className="bg-indigo-50">
                      <th className="py-2 px-4 border-b text-left">Humeur / Envie</th>
                      <th className="py-2 px-4 border-b text-left">Film à découvrir</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Science-fiction à la photographie mémorable</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/ad-astra" className="text-indigo-600 hover:text-indigo-800">Ad Astra</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Thriller psychologique</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/funny-games-us" className="text-indigo-600 hover:text-indigo-800">Funny Games U.S.</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Histoire vraie incroyable</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/last-breath" className="text-indigo-600 hover:text-indigo-800">Last Breath</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Film de procès ou politique</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/le-proces-du-siecle" className="text-indigo-600 hover:text-indigo-800">Le Procès du siècle</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b font-medium">Western Palpitant</td>
                      <td className="py-2 px-4 border-b">
                        <Link href="/films/old-henry" className="text-indigo-600 hover:text-indigo-800">Old Henry</Link>
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
                Chaque film sur MovieHunt.fr est noté sur 10 et accompagné d&apos;une recommandation claire pour vous aider à décider quoi voir ce soir. Tous les films de cette sélection sont notés et analysés dans notre <Link href="/all-films" className="text-indigo-600 hover:text-indigo-800 font-semibold">catalogue complet</Link>, avec le badge <Link href="/huntedbymoviehunt" className="text-indigo-600 hover:text-indigo-800 font-semibold">Hunted by MovieHunt</Link> pour les plus marquants.
              </p>
              <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 flex-shrink-0 text-xl">👉</span>
                  <span><strong>Films à voir absolument</strong> : nous vous expliquons pourquoi ces films méritent votre temps.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 flex-shrink-0 text-xl">👉</span>
                  <span><strong>Films à éviter</strong> : nous vous épargnons des déceptions en vous indiquant les films qui ne valent pas le coup.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 flex-shrink-0 text-xl">👉</span>
                  <span><strong>Pépites méconnues</strong> : nous dénichons des films exceptionnels que vous auriez pu manquer.</span>
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
                  <Link href="/comment-nous-travaillons" className="text-indigo-600 hover:text-indigo-800">Découvrez comment nous travaillons</Link>.
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
