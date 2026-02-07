import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Idées de Films pour Ados : 10 Films Incontournables à Découvrir',
  description: 'Découvrez notre sélection d\'idées de films pour ados : films d\'action, comédies, drames et thrillers parfaits pour les adolescents. Guide complet avec recommandations et où les regarder.',
  keywords: 'idée de film pour ado, film pour adolescent, film ado, que regarder ado, film jeune, recommandation film ado, meilleur film pour ado, film à voir ado',
  openGraph: {
    title: 'Idées de Films pour Ados : 10 Films Incontournables',
    description: 'Sélection de films parfaits pour les adolescents : action, comédie, drame et thriller.',
    type: 'article',
    url: 'https://www.moviehunt.fr/idees-films-pour-ados',
  },
  alternates: {
    canonical: 'https://www.moviehunt.fr/idees-films-pour-ados',
  },
};

export default function IdeesFilmsPourAdos() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Idées de Films pour Ados : 10 Films Incontournables à Découvrir",
            "description": "Guide complet des meilleurs films pour adolescents avec recommandations par genre",
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
              "@id": "https://www.moviehunt.fr/idees-films-pour-ados"
            }
          })
        }}
      />

      {/* En-tête avec image */}
      <header className="mb-12">
        <div className="relative w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src="/images/blog/idee-film-pour-ado.jpg"
            alt="Idée de film pour ado : 10 films incontournables à découvrir pour les adolescents"
            width={1536}
            height={1024}
            priority
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
              Idées de Films pour Ados
            </h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
              10 films incontournables à découvrir
            </p>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="mb-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-gray-800 mb-6">
            Vous cherchez une <strong className="text-indigo-700">idée de film pour ado</strong> qui sorte un peu des sentiers battus ? 
            Que vous ayez envie de réfléchir, de rire ou de vivre une belle aventure, certains films marquent à vie 
            lorsqu'on les découvre à l'adolescence.
          </p>
          
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            L'équipe de <strong className="text-indigo-700">MovieHunt</strong> a sélectionné <strong>10 films incontournables</strong> : 
            6 classiques cultes que tout ado devrait voir, et 4 pépites méconnues à découvrir absolument. 
            Des films qui parlent d'identité, de liberté, de courage et de devenir soi-même.
          </p>

          <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-600 shadow-md mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 mb-3 flex items-center">
              <span className="text-3xl mr-3">📝</span>
              Article complet sur notre blog
            </h2>
            <p className="text-gray-700 mb-4">
              Sur le <strong>blog MovieHunt</strong>, retrouvez l'analyse détaillée de ces 10 films avec :
            </p>
            <ul className="text-gray-700 mb-4 space-y-2">
              <li>✨ <strong>6 films incontournables</strong> : The Truman Show, Ready Player One, Le Cercle des poètes disparus, Mean Girls, Le Monde de Charlie, Hunger Games</li>
              <li>🔍 <strong>4 pépites méconnues</strong> : The Way Way Back, Sing Street, The Spectacular Now, Chronicle</li>
              <li>📺 Les plateformes de streaming où les regarder</li>
              <li>💡 Des conseils pour choisir selon votre humeur</li>
            </ul>
            <Link 
              href="https://www.moviehunt-blog.fr/article/idee-de-film-pour-ado-10-films-incontournables"
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
          Pourquoi cette sélection de films pour ados ?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              Une sélection ciblée
            </h3>
            <p className="text-gray-700">
              Des classiques comme <strong>The Truman Show</strong> et <strong>Le Cercle des poètes disparus</strong> 
              aux pépites comme <strong>Sing Street</strong> et <strong>Chronicle</strong>, ces films abordent 
              des thèmes universels : la quête d'identité, la pression sociale, le courage, l'amitié et les rêves.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">⭐</span>
              Qualité garantie
            </h3>
            <p className="text-gray-700">
              De <strong>Mean Girls</strong> à <strong>Hunger Games</strong>, en passant par <strong>Ready Player One</strong> 
              et <strong>Le Monde de Charlie</strong>, chaque film a été choisi pour sa capacité à marquer durablement 
              les spectateurs adolescents.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500">
            <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">🎬</span>
              Diversité des genres
            </h3>
            <p className="text-gray-700">
              Que vous cherchiez un film pour <strong>réfléchir</strong> (The Truman Show, Chronicle), 
              pour <strong>rire</strong> (Mean Girls, The Way Way Back), pour <strong>l'aventure</strong> 
              (Ready Player One, Hunger Games) ou pour <strong>l'émotion</strong> (Le Monde de Charlie, Sing Street), 
              cette sélection a tout ce qu'il faut.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-yellow-500">
            <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">💡</span>
              Approche pédagogique
            </h3>
            <p className="text-gray-700">
              Ces films ne sont pas de simples divertissements : ils posent des questions sur qui on est vraiment, 
              comment rester soi-même face à la pression sociale, et comment oser défendre ses valeurs. 
              Parfaits pour une soirée entre amis ou un moment de réflexion.
            </p>
          </div>
        </div>
      </section>

      {/* Note importante */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border-l-4 border-amber-500 shadow-lg">
          <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">ℹ️</span>
            À propos de cette sélection
          </h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            <strong>Important :</strong> MovieHunt se concentre habituellement sur des films d'auteur 
            et des pépites méconnues. Cette sélection spéciale pour ados mélange donc des classiques 
            grand public (<strong>Mean Girls</strong>, <strong>Hunger Games</strong>, <strong>Ready Player One</strong>) 
            et des films plus confidentiels (<strong>The Way Way Back</strong>, <strong>Sing Street</strong>, 
            <strong>The Spectacular Now</strong>).
          </p>
          <p className="text-gray-800 leading-relaxed mb-4">
            Résultat : <strong className="text-amber-800">tous ces films ne sont pas forcément présents 
            sur MovieHunt.fr</strong>, car certains sont des blockbusters que nous ne couvrons pas systématiquement 
            dans nos critiques habituelles. Mais ils méritent tous d'être découverts !
          </p>
          <p className="text-gray-800 leading-relaxed">
            Cette liste reste une <strong className="text-amber-800">recommandation sérieuse de l'équipe MovieHunt</strong>, 
            pensée pour offrir aux ados un voyage cinématographique riche et varié. Des films qui parlent 
            de grandir, de douter, de rêver et de devenir soi-même.
          </p>
        </div>
      </section>

      {/* Genres couverts */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Genres de films pour ados couverts
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '💥', genre: 'Action', desc: 'Films d\'action palpitants' },
            { emoji: '😂', genre: 'Comédie', desc: 'Comédies légères et drôles' },
            { emoji: '🎭', genre: 'Drame', desc: 'Drames touchants et profonds' },
            { emoji: '🔍', genre: 'Thriller', desc: 'Thrillers captivants' },
            { emoji: '🚀', genre: 'Science-Fiction', desc: 'SF et mondes futuristes' },
            { emoji: '❤️', genre: 'Romance', desc: 'Histoires d\'amour adolescentes' },
            { emoji: '🎓', genre: 'Coming-of-age', desc: 'Passage à l\'âge adulte' },
            { emoji: '🌟', genre: 'Aventure', desc: 'Grandes aventures épiques' },
          ].map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow border-t-2 border-indigo-200 text-center"
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <h3 className="font-bold text-indigo-900 mb-1">{item.genre}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
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
                  "name": "Quel est le meilleur film pour ado sur Netflix ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mean Girls et Le Monde de Charlie sont d'excellents choix disponibles sur Netflix. Ils mélangent humour, émotion et réflexion."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quels films pour ados sur Disney+ ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ready Player One est disponible via Star sur Disney+. C'est une aventure épique parfaite pour les jeunes gamers, avec des effets visuels spectaculaires."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel film pour ado timide ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le Monde de Charlie et The Way Way Back sont parfaits pour les ados introvertis. Ils parlent de trouver sa place et de s'accepter avec une sincérité rare."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel film d'action pour ado ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hunger Games et Ready Player One offrent de l'action spectaculaire tout en abordant des thèmes profonds comme la résistance et la liberté."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel film pour ado qui aime la musique ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sing Street est le choix idéal ! Un film musical touchant avec une bande-son irrésistible dans le Dublin des années 80."
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
              Quel est le meilleur film pour ado sur Netflix ?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Mean Girls</strong> et <strong>Le Monde de Charlie</strong> sont d'excellents choix 
              disponibles sur Netflix. Ils mélangent humour, émotion et réflexion. Consultez notre article 
              sur le blog pour connaître la disponibilité complète de tous les films.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quels films pour ados sur Disney+ ?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Ready Player One</strong> est disponible via Star sur Disney+. C'est une aventure 
              épique parfaite pour les jeunes gamers, avec des effets visuels spectaculaires et une histoire 
              qui pose des questions pertinentes sur notre rapport au virtuel.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quel film pour ado timide ?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Le Monde de Charlie</strong> et <strong>The Way Way Back</strong> sont parfaits pour 
              les ados introvertis. Ils parlent de trouver sa place et de s'accepter avec une sincérité rare. 
              Ces films doudou touchent droit au cœur.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quel film d'action pour ado ?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Hunger Games</strong> et <strong>Ready Player One</strong> offrent de l'action 
              spectaculaire tout en abordant des thèmes profonds comme la résistance, la manipulation 
              médiatique et la soif de liberté.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Quel film pour ado qui aime la musique ?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Sing Street</strong> est le choix idéal ! Un film musical touchant avec une bande-son 
              irrésistible. Dans le Dublin des années 80, un ado monte un groupe pour impressionner une fille. 
              Parfait pour ceux qui rêvent de liberté et de création.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
