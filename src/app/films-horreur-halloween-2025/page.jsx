'use client';

import Link from 'next/link';
import { FiMoon, FiFilm, FiAward } from 'react-icons/fi';
import { useTranslations } from '@/hooks/useTranslations';

export default function FilmsHorreurHalloween2025() {
  const { t } = useTranslations();
  
  // Schéma JSON-LD pour les moteurs de recherche - format FAQ pour un meilleur positionnement
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quel est le film d'horreur le plus effrayant de cette sélection ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sans hésiter, Funny Games US, noté 10/10 sur MovieHunt, est le film le plus marquant. Sa mise en scène implacable et son réalisme dérangeant en font une expérience terrifiante, idéale pour Halloween."
        }
      },
      {
        "@type": "Question",
        "name": "Quels films originaux regarder pour Halloween 2025 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Si vous voulez sortir des sentiers battus, optez pour Heretic (badge HuntedByMovieHunt) ou 1BR : The Apartment. Ces films ne sont pas de simples divertissements horrifiques : ils plongent dans des thématiques psychologiques et sociales qui laissent une trace durable."
        }
      },
      {
        "@type": "Question",
        "name": "Quelle est la meilleure idée de film à voir entre amis pour Halloween ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Destination Finale : Bloodlines et Until Dawn sont parfaits à plusieurs : spectaculaires, rythmés et bourrés de scènes qui font sursauter. Ils garantissent une ambiance fun et effrayante."
        }
      },
      {
        "@type": "Question",
        "name": "Existe-t-il une liste de films d'horreur méconnus à découvrir ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui ! Sur MovieHunt.fr, nous mettons en avant des films moins connus mais fascinants, comme Triangle, Vivarium ou encore Blood Star. Ces choix originaux sont parfaits pour surprendre vos invités le soir d'Halloween."
        }
      },
      {
        "@type": "Question",
        "name": "Où trouver des critiques détaillées de films d'horreur ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Toutes nos critiques de films d'horreur sont disponibles sur MovieHunt.fr. Chaque film est visionné en version originale et évalué selon des critères précis (réalisation, scénario, jeu des acteurs, photographie, musique et impact émotionnel)."
        }
      }
    ]
  };

  const films = [
    {
      title: "Funny Games US",
      note: "10/10",
      slug: "funny-games-us",
      emoji: "👻",
      translationKey: "funnyGames",
      poster: "https://image.tmdb.org/t/p/w500/nWd7wpRM40YEG1C4PuyCIT2SiEa.jpg"
    },
    {
      title: "Destination Finale : Bloodlines",
      note: "7/10",
      slug: "destination-finale-bloodlines",
      emoji: "🩸",
      translationKey: "destinationFinale",
      poster: "https://image.tmdb.org/t/p/w500/4uI8C2zcfLWRhZDBgd0oTlZjV9j.jpg"
    },
    {
      title: "Until Dawn : La Mort sans fin",
      note: "6/10",
      slug: "until-dawn-la-mort-sans-fin",
      emoji: "🩸",
      translationKey: "untilDawn",
      poster: "https://image.tmdb.org/t/p/w500/lCdHBrSdJG7G7Anx2wcfaMER8Pd.jpg"
    },
    {
      title: "Heretic",
      note: "6/10",
      slug: "heretic",
      emoji: "🔥",
      translationKey: "heretic",
      hunted: true,
      poster: "https://image.tmdb.org/t/p/w500/qcRQkVjP6Zdr4EkHevfqjVEk9KQ.jpg"
    },
    {
      title: "1BR : The Apartment",
      note: "6/10",
      slug: "1br-the-apartment",
      emoji: "🏢",
      translationKey: "1br",
      poster: "https://image.tmdb.org/t/p/w500/aLnGUlGbjWX4dodNt2LMEqNfemE.jpg"
    },
    {
      title: "Triangle",
      note: "6/10",
      slug: "triangle",
      emoji: "🏢",
      translationKey: "triangle",
      poster: "https://image.tmdb.org/t/p/w500/6U3nSrd6uaP0uubsoau1RKToQGR.jpg"
    },
    {
      title: "Vivarium",
      note: "5/10",
      slug: "vivarium",
      emoji: "🪐",
      translationKey: "vivarium",
      poster: "https://image.tmdb.org/t/p/w500/2SAH6napkUWibaAJ4oXr8dAVTIm.jpg"
    },
    {
      title: "Barbarian",
      note: "5/10",
      slug: "barbare",
      emoji: "🏚️",
      translationKey: "barbarian",
      poster: "https://image.tmdb.org/t/p/w500/rJS3o7TgR0pvdtD045kQJQpHXMd.jpg"
    },
    {
      title: "Blood Star",
      note: "5/10",
      slug: "blood-star",
      emoji: "🏚️",
      translationKey: "bloodStar",
      poster: "https://image.tmdb.org/t/p/w500/91iWyahJbZsHvXL5MbAIx1w0Tjx.jpg"
    },
    {
      title: "Night of the Hunted",
      note: "5/10",
      slug: "night-of-the-hunted",
      emoji: "🎯",
      translationKey: "nightOfTheHunted",
      poster: "https://image.tmdb.org/t/p/w500/tfNFmBGBVF1biwOTBgFONAeCaDZ.jpg"
    },
    {
      title: "Vicious",
      note: "5/10",
      slug: "vicious",
      emoji: "🎁",
      translationKey: "vicious",
      poster: "https://image.tmdb.org/t/p/w500/7IntLBzQbsJisbZvaSsNLHoZKRS.jpg",
      bonus: true
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Script JSON-LD pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-sm">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t('halloween.title')}
            </h1>
            <div className="flex justify-center">
              <span className="inline-block w-32 h-1 rounded bg-orange-500 mb-4"></span>
            </div>
          </header>
        
          <section className="mb-8">
            <p className="text-lg leading-relaxed">
              {t('halloween.introP1')}
            </p>
            
            <p className="text-lg leading-relaxed">
              {t('halloween.introP2')}
            </p>
            
            <p className="text-lg leading-relaxed font-semibold">
              {t('halloween.introP3')}
            </p>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Films principaux */}
          {films.map((film, index) => (
            <div key={film.slug}>
              <section className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {film.emoji} {t(`halloween.films.${film.translationKey}.category`)} : {film.title} ({film.note})
                </h2>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex-shrink-0">
                    <Link href={`/films/${film.slug}`}>
                      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                        <img 
                          src={film.poster}
                          alt={`Affiche du film ${film.title}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading={index === 0 ? "eager" : "lazy"}
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
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold">🎥 {film.title}</h3>
                      {film.hunted && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                          <FiAward className="mr-1" /> Hunted
                        </span>
                      )}
                      {film.bonus && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          🎁 BONUS
                        </span>
                      )}
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      {t(`halloween.films.${film.translationKey}.description`)}
                    </p>
                    <Link 
                      href={`/films/${film.slug}`} 
                      className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium transition-colors"
                    >
                      👉 {t('halloween.seeReview')}
                    </Link>
                  </div>
                </div>
              </section>
              
              {index < films.length - 1 && <hr className="my-8 border-gray-300" />}
            </div>
          ))}
          
          <hr className="my-8 border-gray-300" />
          
          {/* Conclusion */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              🎃 {t('halloween.conclusionTitle')}
            </h2>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
              <p className="text-lg leading-relaxed mb-4">
                {t('halloween.conclusionIntro')}
              </p>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span>{t('halloween.conclusionItem1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span>{t('halloween.conclusionItem2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span>{t('halloween.conclusionItem3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span>{t('halloween.conclusionItem4')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span>{t('halloween.conclusionItem5')}</span>
                </li>
              </ul>
              
              <p className="text-lg leading-relaxed mb-4">
                {t('halloween.conclusionOutro1')}
              </p>
              
              <p className="text-lg leading-relaxed font-semibold">
                {t('halloween.conclusionOutro2')}
              </p>
              
              <div className="mt-6 text-center">
                <Link 
                  href="/advanced-search?genres=Horreur" 
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <FiFilm className="mr-2" /> {t('halloween.ctaButton')}
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Section Quel film regarder */}
          <section className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                🎬 {t('halloween.whatToWatchTitle')}
              </h2>
              <p className="text-gray-800 mb-4 leading-relaxed">
                {t('halloween.whatToWatchText')}
              </p>
              <Link 
                href="/quel-film-regarder" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                🎬 {t('halloween.whatToWatchLink')}
              </Link>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* FAQ */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              ❓ {t('halloween.faqTitle')}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <FiMoon className="mr-2 text-orange-600" />
                  🔥 {t('halloween.faq.q1')}
                </h3>
                <p className="text-base leading-relaxed">
                  {t('halloween.faq.a1')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  🎬 {t('halloween.faq.q2')}
                </h3>
                <p className="text-base leading-relaxed">
                  {t('halloween.faq.a2')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  👻 {t('halloween.faq.q3')}
                </h3>
                <p className="text-base leading-relaxed">
                  {t('halloween.faq.a3')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  🕯️ {t('halloween.faq.q4')}
                </h3>
                <p className="text-base leading-relaxed">
                  {t('halloween.faq.a4')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  🎃 {t('halloween.faq.q5')}
                </h3>
                <p className="text-base leading-relaxed">
                  {t('halloween.faq.a5')}
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
