'use client';

import { FiFilm, FiMusic, FiEye, FiFeather, FiCamera, FiAward } from 'react-icons/fi';

export default function CommentNousTravaillonsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comment nous travaillons chez MovieHunt
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
        </header>

        {/* Contenu principal */}
        <article className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 space-y-8">
          {/* Accroche */}
          <section>
            <p className="text-lg text-gray-700 leading-relaxed">
              Vous cherchez une <strong>idée de film à voir</strong> ? Chez MovieHunt, nous visionnons et analysons chaque œuvre – connue ou méconnue – pour vous proposer une <strong>liste de films</strong> unique. Nos <strong>critiques de films</strong>, rédigées après un visionnage en VO, mettent en avant la réalisation, le scénario, la musique, la photographie et le jeu des acteurs. Trouvez dès maintenant votre prochain <strong>film à voir</strong>.
            </p>
          </section>

          {/* Films connus et méconnus */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <FiFilm className="mr-3 text-red-600" />
              Des films connus… mais surtout méconnus
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous prenons le temps de visionner un large choix de films. Certains sont très connus, mais la majorité de nos découvertes concernent des œuvres plus discrètes, parfois passées inaperçues. C'est dans ces perles cachées que se trouvent souvent les émotions les plus fortes.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Lorsqu'un film sort vraiment du lot, il reçoit notre badge <strong>Hunted by MovieHunt</strong> : une marque de confiance pour vous guider vers un <strong>film à voir</strong>.
            </p>
          </section>

          {/* Critères de critique */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <FiAward className="mr-3 text-red-600" />
              Nos critères de critique de film
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Pour qu'un long-métrage figure dans notre <strong>liste de films recommandés</strong>, nous analysons plusieurs aspects essentiels :
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FiFilm className="mr-3 mt-1 text-red-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">La réalisation</h3>
                  <p className="text-gray-700">Le style du metteur en scène et la cohérence de son travail.</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiMusic className="mr-3 mt-1 text-red-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">La bande son et la musique</h3>
                  <p className="text-gray-700">Car une bonne musique peut transformer un film en expérience inoubliable.</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiEye className="mr-3 mt-1 text-red-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Le jeu des acteurs</h3>
                  <p className="text-gray-700">Toujours évalué en version originale (VO), afin de ressentir le vrai talent des comédiens, et non celui des doubleurs.</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiFeather className="mr-3 mt-1 text-red-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Le scénario</h3>
                  <p className="text-gray-700">L'histoire doit captiver, surprendre et rester mémorable.</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiCamera className="mr-3 mt-1 text-red-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">La photographie</h3>
                  <p className="text-gray-700">Chaque plan compte, et l'esthétique visuelle participe à l'impact émotionnel.</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-6">
              Nos <strong>critiques de film</strong> sont donc construites avec soin, pour donner une vision complète et honnête de chaque œuvre.
            </p>
          </section>

          {/* Pourquoi la VO */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-600">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Pourquoi la VO ?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous visionnons tous les films uniquement en <strong>version originale</strong>. Cela permet de juger réellement la performance des acteurs, leurs intonations, leurs émotions et leur authenticité. Pour nous, c'est la seule manière de rester fidèles à l'intention des réalisateurs et des comédiens.
            </p>
          </section>

          {/* Liste de films qui inspire */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Une liste de films qui vous inspire
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sur MovieHunt, vous trouverez bien plus qu'une simple critique. Notre objectif est de créer une <strong>liste de films</strong> variée qui vous donnera toujours une <strong>idée de film à voir</strong> selon vos envies. Drame, action, thriller, comédie ou encore films indépendants méconnus : il y a toujours un titre qui saura vous surprendre.
            </p>
            <p className="text-lg text-gray-900 font-medium">
              👉 MovieHunt, c'est votre compagnon de confiance pour chaque <strong>idée de film</strong>. Alors, si vous cherchez un <strong>film à voir</strong>, explorez nos sélections et laissez-vous guider par nos découvertes.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center pt-6 border-t border-gray-200">
            <a
              href="/all-films"
              className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#DC2625' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2625'}
            >
              Découvrir notre liste de films
            </a>
          </section>
        </article>
      </div>
    </div>
  );
}
