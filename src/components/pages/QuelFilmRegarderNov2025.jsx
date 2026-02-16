'use client';

import Link from 'next/link';

export default function QuelFilmRegarderNov2025() {
  return (
    <>
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
                  loading="lazy"
                />
              </div>
            </Link>
          </div>
          <div className="md:w-3/4">
            <h3 className="text-xl font-semibold">🎥 Greedy People (2024)</h3>
            <p className="my-3">
              Un meurtre, un million de dollars, et une série de décisions catastrophiques dans une petite ville paisible. Joseph Gordon-Levitt brille dans cette comédie noire pleine de rebondissements.
            </p>
            <Link href="/films/greedy-people" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
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
                />
              </div>
            </Link>
          </div>
          <div className="md:w-3/4">
            <h3 className="text-xl font-semibold">🎥 Old Henry (2021)</h3>
            <p className="my-3">
              Un fermier veuf accueille un homme blessé avec une sacoche pleine d&apos;argent. Ce western intimiste cache un secret qui va tout changer. Tim Blake Nelson est magistral dans ce film qui revisite le genre avec intelligence.
            </p>
            <Link href="/films/old-henry" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
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
                />
              </div>
            </Link>
          </div>
          <div className="md:w-3/4">
            <h3 className="text-xl font-semibold">🎥 Tetris (2023)</h3>
            <p className="my-3">
              L&apos;incroyable histoire vraie derrière le jeu vidéo le plus populaire au monde. Un thriller haletant sur fond de Guerre froide avec Taron Egerton, entre espionnage et négociations impossibles en URSS.
            </p>
            <Link href="/films/tetris" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
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
                />
              </div>
            </Link>
          </div>
          <div className="md:w-3/4">
            <h3 className="text-xl font-semibold">🎥 Dom Hemingway (2013)</h3>
            <p className="my-3">
              Après 12 ans de prison, un perceur de coffres-forts légendaire revient à Londres pour récupérer son dû. Jude Law est explosif dans cette comédie noire britannique décalée et savoureuse.
            </p>
            <Link href="/films/dom-hemingway" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
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
                />
              </div>
            </Link>
          </div>
          <div className="md:w-3/4">
            <h3 className="text-xl font-semibold">🎥 Irresistible (2020)</h3>
            <p className="my-3">
              Un consultant politique démocrate aide un colonel à la retraite dans une élection locale. Une satire mordante du système électoral américain avec un twist final brillant qui change tout.
            </p>
            <Link href="/films/irresistible" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
              👉 Voir la fiche sur MovieHunt
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
