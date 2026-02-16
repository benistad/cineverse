'use client';

import { useState } from 'react';
import Link from 'next/link';
import QuelFilmRegarderNov2025 from './QuelFilmRegarderNov2025';
import QuelFilmRegarderJan2026 from './QuelFilmRegarderJan2026';

export default function QuelFilmRegarder() {
  const [activeTab, setActiveTab] = useState('jan2026');
  
  // Schéma JSON-LD enrichi pour les moteurs de recherche
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quel film regarder ce soir ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Si vous cherchez quel film regarder ce soir, MovieHunt propose des idées de films pour tous les goûts : Nuremberg (2025) pour un drame historique captivant, Bugonia (2025) pour une comédie SF délirante, Longlegs (2024) pour un thriller horrifique, ou Last Stop Yuma County (2024) pour un huis clos haletant. Notre sélection est mise à jour chaque mois avec de nouvelles recommandations."
        }
      },
      {
        "@type": "Question",
        "name": "Comment trouver des idées de films à regarder ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour trouver des idées de films à regarder, consultez MovieHunt qui propose des recommandations personnalisées selon vos envies : thrillers, drames, comédies, westerns, films d'horreur. Chaque film à regarder ce soir est noté sur 10 avec une critique sincère pour vous aider à choisir."
        }
      },
      {
        "@type": "Question",
        "name": "Quels sont les meilleurs films à voir en 2026 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les meilleurs films à voir en 2026 incluent Nuremberg pour un drame historique puissant, Bugonia avec Emma Stone pour une comédie SF originale, Rebuilding pour un drame intimiste touchant, et Longlegs avec Nicolas Cage pour un thriller horrifique glaçant. Consultez notre guide complet pour plus d'idées de films selon votre humeur."
        }
      },
      {
        "@type": "Question",
        "name": "Où trouver des recommandations de films personnalisées ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MovieHunt.fr est votre destination pour des recommandations de films personnalisées. Nous proposons une sélection de films à voir triée sur le volet, avec des idées de films pour tous les goûts : films haletants, drames touchants, comédies rythmées. Chaque film est noté, analysé et accompagné d'une critique détaillée."
        }
      },
      {
        "@type": "Question",
        "name": "Quoi regarder ce soir selon mon humeur ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Selon votre humeur, MovieHunt vous propose : un drame historique (Nuremberg), une comédie SF (Bugonia), un thriller horrifique (Longlegs), un western (Old Henry), ou un film d'action (Last Stop Yuma County). Utilisez notre tableau de suggestions pour trouver le film parfait selon vos envies du moment."
        }
      },
      {
        "@type": "Question",
        "name": "Comment MovieHunt sélectionne ses films ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MovieHunt sélectionne ses films grâce à une équipe de passionnés de cinéma qui analyse chaque mois les sorties et les pépites méconnues. Chaque film à regarder est noté sur 10 avec une critique sincère, sans influence des studios. Nous mettons en avant les films à voir absolument et dénichons des pépites exceptionnelles."
        }
      },
      {
        "@type": "Question",
        "name": "Quelle est la différence entre les versions mensuelles ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chaque mois, MovieHunt met à jour sa sélection de films à regarder avec 5 nouvelles recommandations. Les anciennes sélections restent accessibles via les onglets pour retrouver les idées de films des mois précédents. Cela vous permet d'avoir toujours des suggestions fraîches tout en gardant l'historique."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je trouver des films pour une soirée en couple ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, MovieHunt propose des idées de films pour une soirée en couple : drames romantiques, thrillers captivants, comédies légères. Consultez notre sélection mensuelle et notre tableau de suggestions par humeur pour trouver le film parfait pour votre soirée à deux."
        }
      },
      {
        "@type": "Question",
        "name": "Y a-t-il des films méconnus à découvrir ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolument ! MovieHunt se spécialise dans la découverte de pépites méconnues. Parmi nos recommandations : Old Henry (western surprenant), Dom Hemingway (comédie noire britannique), Tetris (thriller historique), et bien d'autres films exceptionnels que vous auriez pu manquer."
        }
      },
      {
        "@type": "Question",
        "name": "Les recommandations sont-elles mises à jour régulièrement ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, MovieHunt met à jour ses recommandations de films chaque mois avec 5 nouvelles idées de films à regarder. Vous pouvez consulter les sélections précédentes via les onglets mensuels. Ajoutez la page à vos favoris pour ne jamais manquer nos nouvelles suggestions."
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
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-800" id="quel-film-regarder">🎬 Quel film regarder ce soir ?</h1>
            <div className="flex justify-center">
              <span className="inline-block w-32 h-1 rounded bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"></span>
            </div>
          </header>
        
          {/* Introduction SEO-optimisée */}
          <div className="mb-8 text-gray-700">
            <p className="text-lg leading-relaxed mb-4">
              <strong>Vous cherchez quel film regarder ce soir ?</strong> Cette question revient chaque fois que vous vous installez devant votre écran. Entre les milliers de films disponibles sur les plateformes de streaming et au cinéma, trouver <strong>des idées de films</strong> qui correspondent vraiment à vos envies peut vite devenir un casse-tête.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              C'est exactement pour ça que MovieHunt existe. Notre mission : vous proposer des <strong>recommandations de films</strong> triées sur le volet, pour que vous ne perdiez plus de temps à scroller sans fin. Que vous cherchiez un <strong>film à regarder ce soir</strong> en solo, en couple, ou entre amis, vous trouverez ici des suggestions personnalisées et sincères.
            </p>
            <p className="text-lg leading-relaxed">
              Chaque mois, nous mettons à jour notre sélection avec 5 nouvelles <strong>idées de films à voir absolument</strong>. Drames captivants, thrillers haletants, comédies surprenantes, westerns revisités... Il y en a pour tous les goûts. Et si vous ne savez toujours pas <strong>quoi regarder ce soir</strong>, consultez notre tableau de suggestions par humeur plus bas dans la page.
            </p>
          </div>

          {/* Bloc de mise à jour */}
          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-6 rounded">
            <p className="text-sm text-indigo-800 font-medium">
              🆕 <strong>Dernière mise à jour : janvier 2026</strong> — 5 nouveaux films ajoutés ce mois-ci !
            </p>
          </div>

          {/* Onglets de sélection de version */}
          <div className="mb-8">
            <div className="flex border-b border-gray-300">
              <button
                onClick={() => setActiveTab('jan2026')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'jan2026'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Janvier 2026
              </button>
              <button
                onClick={() => setActiveTab('nov2025')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'nov2025'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Novembre 2025
              </button>
            </div>
          </div>

          {/* Contenu des deux onglets (rendu SSR pour SEO) */}
          <div className={activeTab === 'jan2026' ? '' : 'hidden'}>
            <QuelFilmRegarderJan2026 />
          </div>
          <div className={activeTab === 'nov2025' ? '' : 'hidden'}>
            <QuelFilmRegarderNov2025 />
          </div>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Autres suggestions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎞️ Idées de films à regarder selon votre humeur</h2>
            
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
          
          {/* FAQ Section - Visible pour SEO */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">❓ Questions fréquentes : Quel film regarder ce soir ?</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Comment trouver des idées de films à regarder ?</h3>
                <p className="text-gray-700">Pour trouver des <strong>idées de films à regarder</strong>, consultez notre sélection mensuelle mise à jour avec 5 nouvelles recommandations. Utilisez les onglets pour accéder aux sélections précédentes ou consultez notre tableau de suggestions par humeur.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Quel film regarder ce soir selon mon humeur ?</h3>
                <p className="text-gray-700">Si vous cherchez <strong>quel film regarder ce soir</strong>, nous proposons des films pour chaque humeur : drames historiques (Nuremberg), comédies SF (Bugonia), thrillers horrifiques (Longlegs), westerns (Old Henry), ou huis clos tendus (Last Stop Yuma County).</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Où trouver des films à regarder en couple ?</h3>
                <p className="text-gray-700">MovieHunt propose des <strong>idées de films</strong> parfaits pour une soirée en couple : drames touchants, thrillers captivants, comédies légères. Consultez notre sélection mensuelle pour trouver le <strong>film à regarder ce soir</strong> qui plaira à vous deux.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Quoi regarder ce soir si je veux découvrir des pépites ?</h3>
                <p className="text-gray-700">Si vous vous demandez <strong>quoi regarder ce soir</strong> et que vous voulez sortir des sentiers battus, découvrez nos pépites méconnues : Old Henry (western surprenant), Dom Hemingway (comédie noire), Tetris (thriller historique), ou Greedy People (comédie noire).</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Les recommandations sont-elles mises à jour régulièrement ?</h3>
                <p className="text-gray-700">Oui, nous mettons à jour nos <strong>recommandations de films</strong> chaque mois avec 5 nouvelles <strong>idées de films à voir</strong>. Les sélections précédentes restent accessibles via les onglets mensuels. Ajoutez cette page à vos favoris pour ne jamais manquer nos nouvelles suggestions.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Comment sont sélectionnés les films recommandés ?</h3>
                <p className="text-gray-700">Chaque <strong>film à regarder</strong> est sélectionné par notre équipe de passionnés de cinéma. Nous analysons les sorties, dénichons des pépites méconnues, et notons chaque film sur 10 avec une critique sincère, sans influence des studios.</p>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Comment nous choisissons nos films */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">📽️ Comment MovieHunt sélectionne vos idées de films</h2>
            
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
