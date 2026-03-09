import Link from 'next/link';

export const metadata = {
  title: 'Comment Nous Notons les Films : Le Système de Notation MovieHunt',
  description: 'Découvrez le système de notation MovieHunt : ce que signifient nos notes de 1 à 10, pourquoi un 5/10 est un bon film, et comment nous évaluons chaque œuvre selon 5 critères précis.',
  keywords: 'système de notation films, note film explication, 5 sur 10 film, barème critique cinéma, comment noter un film, notation MovieHunt, explication note film',
  openGraph: {
    title: 'Comment Nous Notons les Films : Le Système de Notation MovieHunt',
    description: 'Un 4/10 chez MovieHunt n\'est pas un mauvais score. Découvrez notre barème de notation et nos 5 critères d\'évaluation.',
    type: 'article',
    url: 'https://www.moviehunt.fr/comment-nous-notons-les-films',
  },
  alternates: {
    canonical: 'https://www.moviehunt.fr/comment-nous-notons-les-films',
  },
};

const ratings = [
  {
    score: 1,
    label: 'Mauvais film',
    color: 'bg-indigo-300',
    border: 'border-indigo-300',
    text: 'text-indigo-300',
    description: 'Rien à en tirer. Un film qui échoue sur tous les plans : scénario inexistant, réalisation bâclée, jeu d\'acteurs décevant. Nous n\'en recommandons la vision à personne.',
    badge: '⚠️',
  },
  {
    score: 2,
    label: 'Mauvais film',
    color: 'bg-indigo-300',
    border: 'border-indigo-300',
    text: 'text-indigo-300',
    description: 'Globalement raté, mais un élément isolé tire son épingle du jeu : le jeu d\'un acteur, une photographie soignée, une bande-son réussie. Insuffisant pour sauver le film.',
    badge: '👁️',
  },
  {
    score: 3,
    label: 'Mauvais film',
    color: 'bg-indigo-400',
    border: 'border-indigo-400',
    text: 'text-indigo-400',
    description: 'Plusieurs éléments sont réussis, mais l\'ensemble ne convainc pas. Le film souffre de défauts trop importants pour être recommandé.',
    badge: '🔍',
  },
  {
    score: 4,
    label: 'Film moyen',
    color: 'bg-indigo-500',
    border: 'border-indigo-500',
    text: 'text-indigo-500',
    description: 'Film moyen qui se laisse regarder une fois. Divertissant sans être mémorable. Vous ne regretterez pas le visionnage, mais vous n\'y reviendrez probablement pas.',
    badge: '📺',
    highlight: true,
  },
  {
    score: 5,
    label: 'Bon film',
    color: 'bg-indigo-500',
    border: 'border-indigo-500',
    text: 'text-indigo-500',
    description: 'Bon film qui se laisse bien regarder. Qualité solide, agréable à suivre. Une bonne soirée cinéma assurée.',
    badge: '👍',
    highlight: true,
  },
  {
    score: 6,
    label: 'Bon film à revoir',
    color: 'bg-indigo-600',
    border: 'border-indigo-600',
    text: 'text-indigo-600',
    description: 'Bon film à voir et à revoir. Suffisamment riche pour mériter plusieurs visionnages. Vous remarquerez de nouveaux détails à chaque fois.',
    badge: '🔁',
  },
  {
    score: 7,
    label: 'Très bon film',
    color: 'bg-indigo-700',
    border: 'border-indigo-700',
    text: 'text-indigo-700',
    description: 'Très bon film à voir et à revoir. Maîtrise évidente, émotions fortes, qualité durable. Un film qui marque.',
    badge: '⭐',
  },
  {
    score: 8,
    label: 'Très bon film remarquable',
    color: 'bg-indigo-700',
    border: 'border-indigo-700',
    text: 'text-indigo-700',
    description: 'Très bon film avec de nombreux éléments remarquables, à voir et à revoir. Réalisation, jeu d\'acteurs, scénario, photographie, bande-son : tout (ou presque) est au niveau.',
    badge: '🌟',
  },
  {
    score: 9,
    label: 'Excellent film',
    color: 'bg-indigo-800',
    border: 'border-indigo-800',
    text: 'text-indigo-800',
    description: 'Excellent film, foncez. Peu de défauts, beaucoup d\'excellence. Un film que vous recommanderez autour de vous.',
    badge: '🏆',
  },
  {
    score: 10,
    label: 'Chef-d\'œuvre',
    color: 'bg-indigo-800',
    border: 'border-indigo-800',
    text: 'text-indigo-800',
    description: 'Rien à redire, tout est parfait. Une œuvre aboutie sur tous les critères. Nous décernons ce score avec la plus grande parcimonie.',
    badge: '💎',
  },
];

export default function CommentNousNotonsLesFilms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Comment Nous Notons les Films : Le Système de Notation MovieHunt",
            "description": "Explication complète du système de notation MovieHunt de 1 à 10 et des 5 critères d'évaluation",
            "author": { "@type": "Organization", "name": "MovieHunt" },
            "publisher": {
              "@type": "Organization",
              "name": "MovieHunt",
              "logo": { "@type": "ImageObject", "url": "https://www.moviehunt.fr/logo.png" }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.moviehunt.fr/comment-nous-notons-les-films"
            }
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Pourquoi MovieHunt donne des notes de 4 ou 5 à des films regardables ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Contrairement à d'autres sites où la note médiane est souvent autour de 7, MovieHunt utilise l'intégralité du barème de 1 à 10. Un 4/10 signifie que le film se laisse regarder une fois, et un 5/10 est un bon film. Ces notes ne sont pas des mauvaises notes chez nous."
                }
              },
              {
                "@type": "Question",
                "name": "Quels sont les critères de notation de MovieHunt ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "MovieHunt évalue chaque film selon 5 critères : le jeu d'acteur, la réalisation, la bande-son, la photographie et le scénario. La note finale reflète l'équilibre entre tous ces éléments, pas seulement le divertissement procuré."
                }
              },
              {
                "@type": "Question",
                "name": "Un 10/10 est-il fréquent chez MovieHunt ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Non. Le 10/10 est décerné avec la plus grande parcimonie. Il signifie que le film est irréprochable sur tous les critères d'évaluation. C'est une note exceptionnelle réservée aux véritables chefs-d'œuvre."
                }
              },
              {
                "@type": "Question",
                "name": "Pourquoi la note MovieHunt peut différer d'autres critiques ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "MovieHunt ne note pas uniquement l'aspect divertissant d'un film. Nous évaluons l'œuvre dans sa globalité selon 5 critères techniques et artistiques précis. Un film très divertissant peut avoir une note moyenne si sa réalisation ou son scénario sont faibles."
                }
              }
            ]
          })
        }}
      />

      {/* En-tête */}
      <header className="mb-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-700 border-4 border-yellow-400 shadow-xl mb-6">
            <span className="text-white font-bold text-3xl">8</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-900 mb-4">
            Comment Nous Notons les Films
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Le système de notation MovieHunt de 1 à 10, et pourquoi un <strong className="text-indigo-700">4/10 n'est pas une mauvaise note</strong> chez nous.
          </p>
        </div>
      </header>

      {/* Intro : notre philosophie */}
      <section className="mb-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">
          Une notation qui utilise tout le barème
        </h2>
        <p className="text-gray-800 leading-relaxed mb-4">
          Sur beaucoup de sites de critiques, les notes s'entassent entre 6 et 9. Un film "moyen" y obtient déjà 6 ou 7. Chez <strong className="text-indigo-700">MovieHunt</strong>, nous utilisons <strong>l'intégralité du barème de 1 à 10</strong>. Cela signifie qu'un <strong>4/10 est un film moyen qui se laisse regarder</strong>, et qu'un <strong>5/10 est un bon film</strong>. Ce ne sont pas de mauvaises notes.
        </p>
        <p className="text-gray-800 leading-relaxed mb-4">
          Pourquoi cette rigueur ? Parce que nous ne notons pas que le plaisir immédiat. <strong>Nous évaluons l'œuvre</strong> selon plusieurs paramètres artistiques et techniques. Un film très divertissant peut rester à 5 si sa réalisation est paresseuse ou son scénario convenu. À l'inverse, un film exigeant peut atteindre 8 même s'il n'est pas "facile" à regarder.
        </p>
        <div className="bg-white rounded-xl p-5 border-l-4 border-yellow-400 shadow-md">
          <p className="text-gray-900 font-semibold">
            💡 À retenir : chez MovieHunt, <span className="text-indigo-700">la médiane se situe autour de 5-6</span>, pas autour de 7-8 comme ailleurs. Lire nos notes avec ce prisme change tout.
          </p>
        </div>
      </section>

      {/* Les 5 critères */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Nos 5 critères d'évaluation
        </h2>
        <p className="text-gray-700 mb-6">
          Chaque film visionné est analysé selon <strong>5 critères précis</strong>. La note finale reflète l'équilibre entre tous ces éléments.
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { emoji: '🎭', label: 'Jeu d\'acteur', desc: 'La performance des comédiens, leur justesse et leur présence à l\'écran.' },
            { emoji: '🎬', label: 'Réalisation', desc: 'Les choix du metteur en scène : cadrage, montage, rythme, mise en scène.' },
            { emoji: '🎵', label: 'Bande-son', desc: 'La musique originale, les choix sonores, leur adéquation avec le film.' },
            { emoji: '📷', label: 'Photographie', desc: 'La direction artistique, la lumière, les couleurs, la beauté de l\'image.' },
            { emoji: '📝', label: 'Scénario', desc: 'La solidité de l\'histoire, la profondeur des personnages, les dialogues.' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-md border-t-4 border-indigo-500 text-center">
              <div className="text-3xl mb-2">{c.emoji}</div>
              <h3 className="font-bold text-indigo-900 mb-2 text-sm">{c.label}</h3>
              <p className="text-xs text-gray-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Le barème détaillé */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Le barème de notation
        </h2>

        {/* Alerte notes moyennes */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 mb-8 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="text-amber-900">
            <strong>4/10 et 5/10 ne sont pas de mauvaises notes.</strong> Ils signifient respectivement "film moyen regardable une fois" et "bon film". Des films très connus et appréciés peuvent y figurer car d'autres paramètres (réalisation, scénario, photographie) tempèrent la note finale.
          </p>
        </div>

        <div className="space-y-3">
          {ratings.map((r) => (
            <div
              key={r.score}
              className={`flex items-start gap-4 bg-white rounded-xl p-5 shadow-md border-l-4 ${r.border} ${r.highlight ? 'ring-2 ring-amber-300' : ''}`}
            >
              {/* Badge note */}
              <div
                className={`flex-shrink-0 inline-flex items-center justify-center rounded-full ${r.color} border-2 border-yellow-400 shadow`}
                style={{ width: 52, height: 52 }}
              >
                <span className="font-bold text-white text-xl">{r.score}</span>
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-lg">{r.badge}</span>
                  <h3 className={`font-bold text-lg ${r.text}`}>{r.score}/10 — {r.label}</h3>
                  {r.highlight && (
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      À ne pas sous-estimer
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Pourquoi MovieHunt donne des notes de 4 ou 5 à des films regardables ?
            </summary>
            <p className="mt-4 text-gray-700">
              Contrairement à d'autres sites où la note médiane est souvent autour de 7, MovieHunt utilise l'intégralité du barème. Un <strong>4/10</strong> signifie que le film <em>se laisse regarder une fois</em>, et un <strong>5/10</strong> est un bon film. Ces notes ne sont pas des mauvaises notes chez nous — elles correspondent simplement à une évaluation honnête et rigoureuse de l'œuvre.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Pourquoi la note MovieHunt peut-elle différer d'autres critiques ?
            </summary>
            <p className="mt-4 text-gray-700">
              Nous ne notons pas uniquement l'aspect divertissant d'un film. Nous évaluons l'œuvre dans sa globalité selon <strong>5 critères</strong> : jeu d'acteur, réalisation, bande-son, photographie et scénario. Un film très divertissant peut avoir une note plus basse si sa réalisation ou son scénario sont faibles. C'est ce qui différencie notre approche.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              Un 10/10 est-il fréquent chez MovieHunt ?
            </summary>
            <p className="mt-4 text-gray-700">
              Non. Le <strong>10/10</strong> est décerné avec la plus grande parcimonie. Il signifie que le film est irréprochable sur l'ensemble de nos critères. C'est une note exceptionnelle, réservée aux véritables chefs-d'œuvre où rien ne vient ternir l'ensemble.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              À partir de quelle note recommande-t-on un film ?
            </summary>
            <p className="mt-4 text-gray-700">
              Dès <strong>5/10</strong>, le film mérite d'être vu. À partir de <strong>6/10</strong>, nous le recommandons sans réserve pour une soirée cinéma. Les <strong>7/10 et plus</strong> sont à voir et à revoir. Les notes en dessous de 4 ne correspondent à des films que nous recommanderions activement.
            </p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Envie de découvrir nos films notés ?</h2>
          <p className="text-indigo-100 mb-6 text-lg">
            Explorez notre sélection et retrouvez des centaines de critiques détaillées.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/all-films"
              className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 transition-all"
            >
              Tous les films
            </Link>
            <Link
              href="/comment-nous-travaillons"
              className="px-6 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition-all"
            >
              Notre méthode de travail
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
