'use client';

import Link from 'next/link';
import { FiMoon, FiFilm, FiAward } from 'react-icons/fi';

export default function FilmsHorreurHalloween2025() {
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
      category: "Le coup de maître",
      description: "Si vous cherchez un film qui vous laisse sans voix, Funny Games US est incontournable. Brutal, dérangeant et sans concession, il bouleverse tous les codes du cinéma d'horreur. Avec sa note parfaite de 10/10, c'est le choix ultime pour un Halloween qui reste gravé dans la mémoire.",
      poster: "https://image.tmdb.org/t/p/w500/nWd7wpRM40YEG1C4PuyCIT2SiEa.jpg"
    },
    {
      title: "Destination Finale : Bloodlines",
      note: "7/10",
      slug: "destination-finale-bloodlines",
      emoji: "🩸",
      category: "Les sensations fortes",
      description: "Un retour réussi de la saga culte, avec toujours cette mécanique implacable où le destin frappe de manière inventive et sanglante.",
      poster: "https://image.tmdb.org/t/p/w500/4uI8C2zcfLWRhZDBgd0oTlZjV9j.jpg"
    },
    {
      title: "Until Dawn : La Mort sans fin",
      note: "6/10",
      slug: "until-dawn-la-mort-sans-fin",
      emoji: "🩸",
      category: "Les sensations fortes",
      description: "Inspiré de l'univers vidéoludique, ce film mise sur l'immersion et la tension. Une expérience efficace pour ceux qui aiment se sentir au cœur de l'action.",
      poster: "https://image.tmdb.org/t/p/w500/lCdHBrSdJG7G7Anx2wcfaMER8Pd.jpg"
    },
    {
      title: "Heretic",
      note: "6/10",
      slug: "heretic",
      emoji: "🔥",
      category: "La révélation Hunted",
      description: "Dans une ambiance suffocante et dérangeante, Heretic s'impose comme l'une des découvertes marquantes de ces dernières années. Assez audacieux pour obtenir le badge HuntedByMovieHunt, ce film mérite une place de choix dans votre soirée d'horreur.",
      hunted: true,
      poster: "https://image.tmdb.org/t/p/w500/qcRQkVjP6Zdr4EkHevfqjVEk9KQ.jpg"
    },
    {
      title: "1BR : The Apartment",
      note: "6/10",
      slug: "1br-the-apartment",
      emoji: "🏢",
      category: "Les cauchemars psychologiques",
      description: "Un thriller glaçant sur la vie en communauté, où la promesse d'un nouveau départ vire au cauchemar sectaire.",
      poster: "https://image.tmdb.org/t/p/w500/aLnGUlGbjWX4dodNt2LMEqNfemE.jpg"
    },
    {
      title: "Triangle",
      note: "6/10",
      slug: "triangle",
      emoji: "🏢",
      category: "Les cauchemars psychologiques",
      description: "Un jeu terrifiant avec le temps et la boucle infernale, idéal pour ceux qui aiment les récits qui se dérobent sous leurs pieds.",
      poster: "https://image.tmdb.org/t/p/w500/6U3nSrd6uaP0uubsoau1RKToQGR.jpg"
    },
    {
      title: "Vivarium",
      note: "5/10",
      slug: "vivarium",
      emoji: "🪐",
      category: "L'étrangeté inquiétante",
      description: "Avec son décor de banlieue parfaite mais étouffante, Vivarium explore la prison de la normalité. Noté 5/10, il divise, mais laisse une impression durable.",
      poster: "https://image.tmdb.org/t/p/w500/2SAH6napkUWibaAJ4oXr8dAVTIm.jpg"
    },
    {
      title: "Barbarian",
      note: "5/10",
      slug: "barbare",
      emoji: "🏚️",
      category: "Les secrets cachés",
      description: "Un film qui commence comme un simple cauchemar de location Airbnb, avant de basculer dans l'horreur la plus imprévisible.",
      poster: "https://image.tmdb.org/t/p/w500/rJS3o7TgR0pvdtD045kQJQpHXMd.jpg"
    },
    {
      title: "Blood Star",
      note: "5/10",
      slug: "blood-star",
      emoji: "🏚️",
      category: "Les secrets cachés",
      description: "Moins connu, mais marquant par son atmosphère viscérale et sa brutalité. Un choix audacieux pour les amateurs de sensations fortes.",
      poster: "https://image.tmdb.org/t/p/w500/91iWyahJbZsHvXL5MbAIx1w0Tjx.jpg"
    },
    {
      title: "Night of the Hunted",
      note: "5/10",
      slug: "night-of-the-hunted",
      emoji: "🎯",
      category: "La tension pure",
      description: "Un huis clos à ciel ouvert où chaque instant compte. Avec son intensité et son rythme sec, Night of the Hunted est le film parfait pour maintenir l'adrénaline jusqu'au bout de la nuit.",
      poster: "https://image.tmdb.org/t/p/w500/tfNFmBGBVF1biwOTBgFONAeCaDZ.jpg"
    },
    {
      title: "Vicious",
      note: "5/10",
      slug: "vicious",
      emoji: "🎁",
      category: "Film Bonus",
      description: "Un thriller horrifique qui joue avec vos peurs intérieures. Polly reçoit une mystérieuse boîte accompagnée d'une consigne étrange : y placer une chose dont elle a besoin, une chose qu'elle déteste et une chose qu'elle aime. Ce rituel se transforme vite en cauchemar où elle doit affronter les ténèbres, non seulement autour d'elle, mais aussi en elle.",
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
              🎃 Films d&apos;horreur pour Halloween 2025 : notre sélection terrifiante sur MovieHunt
            </h1>
            <div className="flex justify-center">
              <span className="inline-block w-32 h-1 rounded bg-orange-500 mb-4"></span>
            </div>
          </header>
        
          <section className="mb-8">
            <p className="text-lg leading-relaxed">
              <strong>Halloween</strong>, c&apos;est la nuit idéale pour frissonner devant un bon <strong>film d&apos;horreur</strong>. Mais plutôt que de revoir toujours les mêmes classiques, pourquoi ne pas plonger dans une sélection originale, mêlant expériences dérangeantes, thrillers psychologiques et découvertes marquantes ?
            </p>
            
            <p className="text-lg leading-relaxed">
              Sur <strong>MovieHunt.fr</strong>, nous prenons le temps de visionner chaque film, de les noter selon nos critères (réalisation, scénario, jeu des acteurs, photographie, bande-son et impact émotionnel) et de mettre en avant les véritables pépites grâce au badge <strong>HuntedByMovieHunt</strong>.
            </p>
            
            <p className="text-lg leading-relaxed font-semibold">
              Voici notre liste de <strong>films d&apos;horreur à voir pour Halloween 2025</strong>.
            </p>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Films principaux */}
          {films.map((film, index) => (
            <div key={film.slug}>
              <section className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {film.emoji} {film.category} : {film.title} ({film.note})
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
                      {film.description}
                    </p>
                    <Link 
                      href={`/films/${film.slug}`} 
                      className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium transition-colors"
                    >
                      👉 Voir la fiche complète sur MovieHunt
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
              🎃 Conclusion : quelle idée de film d&apos;horreur pour Halloween 2025 ?
            </h2>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
              <p className="text-lg leading-relaxed mb-4">
                Cette année, notre sélection <strong>MovieHunt</strong> vous propose une palette variée :
              </p>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span><strong>L&apos;excellence dérangeante</strong> avec Funny Games US</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span><strong>Le grand spectacle</strong> avec Destination Finale : Bloodlines</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span><strong>Les révélations audacieuses</strong> comme Heretic</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span><strong>Les cauchemars psychologiques</strong> tels que 1BR ou Triangle</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span><strong>Et des expériences atypiques</strong> comme Vivarium ou Barbarian</span>
                </li>
              </ul>
              
              <p className="text-lg leading-relaxed mb-4">
                Autant d&apos;<strong>idées de films à voir pour Halloween</strong> qui transformeront votre soirée en expérience inoubliable.
              </p>
              
              <p className="text-lg leading-relaxed font-semibold">
                Alors, préparez vos pop-corn, baissez les lumières… et laissez la peur vous envelopper.
              </p>
              
              <div className="mt-6 text-center">
                <Link 
                  href="/advanced-search?genres=Horreur" 
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <FiFilm className="mr-2" /> Découvrez tous nos films d&apos;horreur
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Section Quel film regarder */}
          <section className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                🎬 Vous ne savez pas quel film regarder ce soir ?
              </h2>
              <p className="text-gray-800 mb-4 leading-relaxed">
                Au-delà de l&apos;horreur, découvrez notre sélection variée de <strong>pépites méconnues</strong> pour tous les goûts : comédies noires, westerns surprenants, thrillers fascinants et bien plus encore. Chaque film est noté, analysé et recommandé par MovieHunt.
              </p>
              <Link 
                href="/quel-film-regarder" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                🎬 Découvrez notre guide "Quel film regarder ce soir ?" →
              </Link>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* FAQ */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              ❓ FAQ – Films d&apos;horreur pour Halloween 2025
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <FiMoon className="mr-2 text-orange-600" />
                  🔥 Quel est le film d&apos;horreur le plus effrayant de cette sélection ?
                </h3>
                <p className="text-base leading-relaxed">
                  Sans hésiter, <strong>Funny Games US</strong>, noté <strong>10/10</strong> sur MovieHunt, est le film le plus marquant. Sa mise en scène implacable et son réalisme dérangeant en font une expérience terrifiante, idéale pour Halloween.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  🎬 Quels films originaux regarder pour Halloween 2025 ?
                </h3>
                <p className="text-base leading-relaxed">
                  Si vous voulez sortir des sentiers battus, optez pour <strong>Heretic</strong> (badge HuntedByMovieHunt) ou <strong>1BR : The Apartment</strong>. Ces films ne sont pas de simples divertissements horrifiques : ils plongent dans des thématiques psychologiques et sociales qui laissent une trace durable.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  👻 Quelle est la meilleure idée de film à voir entre amis pour Halloween ?
                </h3>
                <p className="text-base leading-relaxed">
                  <strong>Destination Finale : Bloodlines</strong> et <strong>Until Dawn</strong> sont parfaits à plusieurs : spectaculaires, rythmés et bourrés de scènes qui font sursauter. Ils garantissent une ambiance fun et effrayante.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  🕯️ Existe-t-il une liste de films d&apos;horreur méconnus à découvrir ?
                </h3>
                <p className="text-base leading-relaxed">
                  Oui ! Sur <strong>MovieHunt.fr</strong>, nous mettons en avant des films moins connus mais fascinants, comme <strong>Triangle</strong>, <strong>Vivarium</strong> ou encore <strong>Blood Star</strong>. Ces choix originaux sont parfaits pour surprendre vos invités le soir d&apos;Halloween.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  🎃 Où trouver des critiques détaillées de films d&apos;horreur ?
                </h3>
                <p className="text-base leading-relaxed">
                  Toutes nos critiques de films d&apos;horreur sont disponibles sur <strong>MovieHunt.fr</strong>. Chaque film est visionné en version originale et évalué selon des critères précis (réalisation, scénario, jeu des acteurs, photographie, musique et impact émotionnel).
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
