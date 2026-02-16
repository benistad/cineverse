import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Quel Film Regarder en Famille ? 11 Idées de Films pour Tous (2026)',
  description: 'Vous cherchez quel film regarder en famille ce soir ? Découvrez 11 idées de films pour tous les âges : aventure, émotion, comédie. Films familiaux incontournables et pépites à découvrir.',
  keywords: 'quel film regarder en famille, idée de film en famille, film en famille, film pour toute la famille, que regarder en famille, film familial, meilleur film famille, film à voir en famille',
  openGraph: {
    title: 'Quel Film Regarder en Famille ? 11 Idées de Films pour Tous',
    description: 'Découvrez 11 films parfaits pour une soirée en famille : aventure, émotion, comédie. Pour tous les âges.',
    type: 'article',
    url: 'https://www.moviehunt.fr/quel-film-regarder-en-famille',
  },
  alternates: {
    canonical: 'https://www.moviehunt.fr/quel-film-regarder-en-famille',
  },
};

export default function QuelFilmRegarderEnFamille() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Quel Film Regarder en Famille ? 11 Idées de Films Incontournables",
            "description": "Guide complet des meilleurs films à regarder en famille avec recommandations pour tous les âges",
            "author": {
              "@type": "Organization",
              "name": "MovieHunt"
            },
            "publisher": {
              "@type": "Organization",
              "name": "MovieHunt",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.moviehunt.fr/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.moviehunt.fr/quel-film-regarder-en-famille"
            }
          })
        }}
      />

      {/* En-tête avec image */}
      <header className="mb-12">
        <div className="relative w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src="/images/blog/film-en-famille.jpg"
            alt="Quel film regarder en famille : 11 films incontournables pour tous les âges"
            width={1536}
            height={1024}
            priority
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
              Quel Film Regarder en Famille ?
            </h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
              11 films incontournables pour tous les âges
            </p>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="mb-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-gray-800 mb-6">
            Vous vous demandez <strong className="text-indigo-700">quel film regarder en famille ce soir</strong> ? 
            Trouver le film parfait qui plaira à la fois aux enfants et aux adultes peut être un véritable casse-tête. 
            Entre les goûts de chacun et les différences d'âge, il faut dénicher cette <strong className="text-indigo-700">idée de film en famille</strong> qui rassemblera tout le monde devant l'écran.
          </p>
          
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            L'équipe de <strong className="text-indigo-700">MovieHunt</strong> a sélectionné pour vous <strong>11 films incontournables</strong> qui ont fait leurs preuves auprès des familles. 
            De l'aventure épique à la comédie légère, en passant par des drames inspirants, cette liste couvre tous les genres pour satisfaire petits et grands. 
            Préparez le pop-corn et installez-vous confortablement !
          </p>

          <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-600 shadow-md mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 mb-3 flex items-center">
              <span className="text-3xl mr-3">📝</span>
              Article complet sur notre blog
            </h2>
            <p className="text-gray-700 mb-4">
              Sur le <strong>blog MovieHunt</strong>, retrouvez l'analyse détaillée de ces 11 films avec :
            </p>
            <ul className="text-gray-700 mb-4 space-y-2">
              <li>🎬 <strong>11 films pour toute la famille</strong> : RRR, Jungle Cruise, Free Guy, Dans l'ombre de Mary, Jusqu'au bout du rêve, Le Fondateur, Newsies, Hunt for the Wilderpeople, Captain Fantastic, October Sky, Seabiscuit</li>
              <li>👨‍👩‍👧‍👦 Des recommandations selon l'âge des enfants</li>
              <li>📺 Les plateformes de streaming où les regarder</li>
              <li>💡 Des conseils pour choisir le bon film pour votre soirée</li>
            </ul>
            <Link 
              href="https://www.moviehunt-blog.fr/article/quel-film-regarder-en-famille"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Lire l'article complet sur le blog
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi cette sélection */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Pourquoi ces films pour une soirée en famille ?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              Pour tous les âges
            </h3>
            <p className="text-gray-700">
              De <strong>Jungle Cruise</strong> pour les plus jeunes à <strong>Captain Fantastic</strong> pour les familles avec ados, 
              chaque film a été choisi pour sa capacité à captiver différentes générations. Des histoires universelles 
              qui parlent de courage, de rêves et de famille.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">⭐</span>
              Qualité garantie
            </h3>
            <p className="text-gray-700">
              De <strong>RRR</strong> à <strong>Seabiscuit</strong>, en passant par <strong>Free Guy</strong> 
              et <strong>October Sky</strong>, chaque film offre un divertissement de qualité avec des valeurs positives. 
              Pas de violence gratuite, mais de vraies émotions et des messages inspirants.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500">
            <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">🎬</span>
              Diversité des genres
            </h3>
            <p className="text-gray-700">
              Que vous cherchiez de l'<strong>action spectaculaire</strong> (RRR), de l'<strong>aventure</strong> 
              (Jungle Cruise), de la <strong>comédie</strong> (Free Guy), du <strong>drame inspirant</strong> 
              (October Sky, Seabiscuit) ou de la <strong>nostalgie</strong> (Dans l'ombre de Mary), 
              cette sélection a tout ce qu'il faut.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-yellow-500">
            <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">💡</span>
              Moments de partage
            </h3>
            <p className="text-gray-700">
              Ces films ne sont pas de simples divertissements : ils créent des moments de partage et ouvrent 
              des discussions sur des thèmes importants comme la persévérance (<strong>October Sky</strong>), 
              la créativité (<strong>Dans l'ombre de Mary</strong>) ou la solidarité (<strong>Newsies</strong>).
            </p>
          </div>
        </div>
      </section>

      {/* Les 11 films */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Les 11 films à regarder en famille
        </h2>
        
        <div className="space-y-6">
          {/* Film 1 - RRR */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-red-500">
            <h3 className="text-2xl font-bold text-red-900 mb-3">
              1. 🔥 Roudram Ranam Rudhiram (RRR)
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Action épique, Aventure | <strong>Durée :</strong> 3h07
            </p>
            <p className="text-gray-700 leading-relaxed">
              Si vous cherchez une <strong>idée de film en famille spectaculaire</strong>, RRR est fait pour vous. 
              Ce blockbuster indien est une explosion d'action, de danse et d'émotion. L'histoire de deux révolutionnaires 
              légendaires captivera les adolescents et les adultes avec ses scènes d'action à couper le souffle. 
              <em>Attention : certaines scènes peuvent être intenses pour les plus jeunes (recommandé 12+).</em>
            </p>
          </div>

          {/* Film 2 - Jungle Cruise */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
            <h3 className="text-2xl font-bold text-green-900 mb-3">
              2. 🚢 Jungle Cruise
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Aventure, Comédie | <strong>Durée :</strong> 2h07
            </p>
            <p className="text-gray-700 leading-relaxed">
              Vous ne savez pas <strong>quel film regarder en famille</strong> un dimanche après-midi ? Jungle Cruise 
              est la réponse idéale. Dwayne Johnson et Emily Blunt forment un duo hilarant dans cette aventure inspirée 
              de l'attraction Disney. Humour, mystère et paysages exotiques : tous les ingrédients d'un bon moment en famille.
            </p>
          </div>

          {/* Film 3 - Free Guy */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-900 mb-3">
              3. 🎮 Free Guy
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Comédie, Science-Fiction | <strong>Durée :</strong> 1h55
            </p>
            <p className="text-gray-700 leading-relaxed">
              Voici une <strong>idée de film en famille</strong> qui parlera particulièrement aux gamers ! Ryan Reynolds 
              incarne Guy, un personnage de jeu vidéo qui découvre qu'il n'est pas réel. Free Guy mélange action, humour 
              et réflexion sur l'identité. Les références aux jeux vidéo raviront les ados tandis que le message positif 
              touchera les parents.
            </p>
          </div>

          {/* Film 4 - Dans l'ombre de Mary */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-pink-500">
            <h3 className="text-2xl font-bold text-pink-900 mb-3">
              4. 🎭 Dans l'ombre de Mary (Saving Mr. Banks)
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Drame, Biographie | <strong>Durée :</strong> 2h05
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pour ceux qui se demandent <strong>quel film regarder en famille</strong> avec une touche de nostalgie, 
              ce film raconte les coulisses de la création de Mary Poppins. Tom Hanks incarne Walt Disney dans cette 
              histoire touchante sur la créativité et les souvenirs d'enfance. Un film qui plaira aux fans de Disney 
              de toutes les générations.
            </p>
          </div>

          {/* Film 5 - Jusqu'au bout du rêve */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-3">
              5. ⚾ Jusqu'au bout du rêve (Field of Dreams)
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Drame, Fantastique | <strong>Durée :</strong> 1h47
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cette <strong>idée de film en famille</strong> est un classique américain. Kevin Costner joue un fermier 
              qui entend une voix lui demandant de construire un terrain de baseball. Jusqu'au bout du rêve parle de foi, 
              de famille et de seconde chance. Un film parfait pour ouvrir une discussion avec vos enfants sur l'importance 
              de suivre ses rêves.
            </p>
          </div>

          {/* Film 6 - Le Fondateur */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-yellow-900 mb-3">
              6. 🍔 Le Fondateur (The Founder)
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Drame, Biographie | <strong>Durée :</strong> 1h55
            </p>
            <p className="text-gray-700 leading-relaxed">
              Vous cherchez <strong>quel film regarder en famille</strong> qui soit aussi éducatif ? Le Fondateur raconte 
              l'histoire fascinante de Ray Kroc et la création de McDonald's. Michael Keaton livre une performance captivante. 
              Ce film est idéal pour les familles qui aiment les histoires d'entrepreneuriat et les débats sur l'éthique 
              des affaires.
            </p>
          </div>

          {/* Film 7 - Newsies */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-indigo-500">
            <h3 className="text-2xl font-bold text-indigo-900 mb-3">
              7. 📰 Newsies
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Comédie musicale, Drame | <strong>Durée :</strong> 2h01
            </p>
            <p className="text-gray-700 leading-relaxed">
              Une <strong>idée de film en famille</strong> musicale et entraînante ! Ce film Disney de 1992 suit des jeunes 
              vendeurs de journaux qui se rebellent contre l'injustice à New York. Newsies combine chorégraphies énergiques, 
              chansons mémorables et un message fort sur la solidarité. Les enfants adoreront les numéros musicaux.
            </p>
          </div>

          {/* Film 8 - Hunt for the Wilderpeople */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-teal-500">
            <h3 className="text-2xl font-bold text-teal-900 mb-3">
              8. 🌲 Hunt for the Wilderpeople
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Comédie, Aventure | <strong>Durée :</strong> 1h41
            </p>
            <p className="text-gray-700 leading-relaxed">
              Si vous ne savez pas <strong>quel film regarder en famille</strong> et que vous aimez l'humour décalé, 
              ce film néo-zélandais est une pépite. Un jeune garçon et son oncle adoptif bourru se retrouvent en cavale 
              dans la nature sauvage. Hunt for the Wilderpeople est drôle, touchant et visuellement magnifique. 
              Une vraie découverte !
            </p>
          </div>

          {/* Film 9 - Captain Fantastic */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
            <h3 className="text-2xl font-bold text-purple-900 mb-3">
              9. 🏕️ Captain Fantastic
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Drame, Comédie | <strong>Durée :</strong> 1h58
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cette <strong>idée de film en famille</strong> est plus profonde et suscitera des discussions. Viggo Mortensen 
              joue un père qui élève ses six enfants dans la forêt, loin de la société moderne. Captain Fantastic questionne 
              l'éducation, les valeurs et ce que signifie vraiment préparer ses enfants à la vie. Recommandé pour les familles 
              avec des adolescents.
            </p>
          </div>

          {/* Film 10 - October Sky */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500">
            <h3 className="text-2xl font-bold text-orange-900 mb-3">
              10. 🚀 October Sky
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Drame, Biographie | <strong>Durée :</strong> 1h48
            </p>
            <p className="text-gray-700 leading-relaxed">
              Vous cherchez <strong>quel film regarder en famille</strong> pour inspirer vos enfants ? October Sky est basé 
              sur l'histoire vraie d'Homer Hickam, un fils de mineur qui rêve de construire des fusées. Ce film montre que 
              la passion et la persévérance peuvent mener loin, même quand tout semble contre vous. Parfait pour motiver 
              les jeunes rêveurs.
            </p>
          </div>

          {/* Film 11 - Seabiscuit */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-emerald-500">
            <h3 className="text-2xl font-bold text-emerald-900 mb-3">
              11. 🐴 Seabiscuit
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>Genre :</strong> Drame, Sport | <strong>Durée :</strong> 2h20
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pour terminer cette liste d'<strong>idées de films en famille</strong>, voici l'histoire vraie de Seabiscuit, 
              un cheval de course improbable devenu champion durant la Grande Dépression. Ce film parle de résilience, 
              d'espoir et de secondes chances. Seabiscuit touchera toutes les générations et rappelle que les outsiders 
              peuvent accomplir de grandes choses.
            </p>
          </div>
        </div>
      </section>

      {/* Conseils pour choisir */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Comment choisir le bon film pour votre soirée en famille ?
        </h2>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg">
          <p className="text-lg text-gray-800 mb-6">
            Maintenant que vous avez plusieurs <strong>idées de films en famille</strong>, voici quelques conseils 
            pour faire le bon choix :
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-3xl mr-4">👶</span>
              <div>
                <h3 className="font-bold text-indigo-900 mb-2">Tenez compte de l'âge</h3>
                <p className="text-gray-700">
                  Certains films comme <strong>RRR</strong> ou <strong>Captain Fantastic</strong> conviennent mieux 
                  aux familles avec des adolescents, tandis que <strong>Jungle Cruise</strong> et <strong>Newsies</strong> 
                  sont parfaits pour les plus jeunes.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4">🎭</span>
              <div>
                <h3 className="font-bold text-indigo-900 mb-2">Variez les genres</h3>
                <p className="text-gray-700">
                  Alternez entre action (<strong>RRR</strong>), comédie (<strong>Free Guy</strong>, 
                  <strong>Hunt for the Wilderpeople</strong>) et drame (<strong>October Sky</strong>, 
                  <strong>Seabiscuit</strong>) pour satisfaire tout le monde.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4">💬</span>
              <div>
                <h3 className="font-bold text-indigo-900 mb-2">Préparez des discussions</h3>
                <p className="text-gray-700">
                  Beaucoup de ces films abordent des thèmes profonds qui peuvent enrichir vos échanges : 
                  l'entrepreneuriat (<strong>Le Fondateur</strong>), la persévérance (<strong>October Sky</strong>), 
                  l'éducation (<strong>Captain Fantastic</strong>).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4">🍿</span>
              <div>
                <h3 className="font-bold text-indigo-900 mb-2">Créez l'ambiance</h3>
                <p className="text-gray-700">
                  Préparez du pop-corn, installez des coussins, éteignez les lumières. Une bonne soirée cinéma 
                  en famille, c'est aussi une question d'ambiance !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Découvrir plus */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Envie de découvrir plus de films ?
          </h2>
          <p className="text-lg md:text-xl mb-6 text-indigo-100">
            Sur MovieHunt, nous proposons des centaines de critiques de films soigneusement 
            sélectionnés, notés selon 5 critères précis et accompagnés de recommandations personnalisées.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/all-films"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300"
            >
              Découvrir tous nos films
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link 
              href="/quel-film-regarder"
              className="inline-flex items-center px-6 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300"
            >
              Trouver mon film idéal
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SEO */}
      <section className="mb-12">
        {/* Schema.org JSON-LD pour FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Quel film regarder en famille ce soir ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pour une soirée en famille, nous recommandons Jungle Cruise pour l'aventure et l'humour, Free Guy pour les famers, ou Hunt for the Wilderpeople pour une comédie touchante. Consultez notre liste complète de 11 films pour tous les âges."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel film familial sur Netflix ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Plusieurs films de notre sélection sont disponibles sur Netflix selon les régions : Free Guy, Hunt for the Wilderpeople, et October Sky. Consultez l'article complet sur notre blog pour connaître la disponibilité actuelle."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel film pour toute la famille avec des enfants ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Jungle Cruise, Free Guy et Newsies sont parfaits pour les familles avec enfants. Ils combinent action, humour et messages positifs sans violence excessive."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel film en famille avec des ados ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pour les familles avec adolescents, RRR offre de l'action spectaculaire, Captain Fantastic suscite des discussions profondes, et Le Fondateur raconte une histoire d'entrepreneuriat fascinante."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel film inspirant pour toute la famille ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "October Sky et Seabiscuit sont des films inspirants basés sur des histoires vraies. Ils parlent de persévérance, de rêves et de résilience, parfaits pour motiver toute la famille."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Y a-t-il des comédies familiales dans la sélection ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Oui ! Free Guy et Hunt for the Wilderpeople sont des comédies hilarantes qui plairont à toute la famille. Newsies est également une comédie musicale entraînante."
                  }
                }
              ]
            })
          }}
        />
        
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Questions fréquentes
        </h2>
        
        <div className="space-y-4">
          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quel film regarder en famille ce soir ?
            </summary>
            <p className="mt-4 text-gray-700">
              Pour une soirée en famille, nous recommandons <strong>Jungle Cruise</strong> pour l'aventure et l'humour, 
              <strong>Free Guy</strong> pour les gamers, ou <strong>Hunt for the Wilderpeople</strong> pour une comédie 
              touchante. Consultez notre liste complète de 11 films pour tous les âges.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quel film familial sur Netflix ?
            </summary>
            <p className="mt-4 text-gray-700">
              Plusieurs films de notre sélection sont disponibles sur Netflix selon les régions : <strong>Free Guy</strong>, 
              <strong>Hunt for the Wilderpeople</strong>, et <strong>October Sky</strong>. Consultez l'article complet 
              sur notre blog pour connaître la disponibilité actuelle sur toutes les plateformes.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quel film pour toute la famille avec des enfants ?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Jungle Cruise</strong>, <strong>Free Guy</strong> et <strong>Newsies</strong> sont parfaits 
              pour les familles avec enfants. Ils combinent action, humour et messages positifs sans violence excessive. 
              Les numéros musicaux de Newsies raviront particulièrement les plus jeunes.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quel film en famille avec des ados ?
            </summary>
            <p className="mt-4 text-gray-700">
              Pour les familles avec adolescents, <strong>RRR</strong> offre de l'action spectaculaire, 
              <strong>Captain Fantastic</strong> suscite des discussions profondes sur l'éducation et les valeurs, 
              et <strong>Le Fondateur</strong> raconte une histoire d'entrepreneuriat fascinante.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quel film inspirant pour toute la famille ?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>October Sky</strong> et <strong>Seabiscuit</strong> sont des films inspirants basés sur des 
              histoires vraies. Ils parlent de persévérance, de rêves et de résilience. Parfaits pour motiver toute 
              la famille et ouvrir des discussions sur l'importance de ne jamais abandonner ses rêves.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Y a-t-il des comédies familiales dans la sélection ?
            </summary>
            <p className="mt-4 text-gray-700">
              Oui ! <strong>Free Guy</strong> et <strong>Hunt for the Wilderpeople</strong> sont des comédies hilarantes 
              qui plairont à toute la famille. <strong>Newsies</strong> est également une comédie musicale entraînante 
              avec des chorégraphies spectaculaires et des chansons mémorables.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
