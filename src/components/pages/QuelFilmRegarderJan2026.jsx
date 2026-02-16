'use client';

import Link from 'next/link';

export default function QuelFilmRegarderJan2026() {
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
                  loading="lazy"
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
              👉 Voir la fiche sur MovieHunt
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
              👉 Voir la fiche sur MovieHunt
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
              👉 Voir la fiche sur MovieHunt
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
              👉 Voir la fiche sur MovieHunt
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
              👉 Voir la fiche sur MovieHunt
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
