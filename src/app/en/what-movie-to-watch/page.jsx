'use client';

import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function WhatMovieToWatch() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What movie to watch tonight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Discover our selection of hidden gems to watch tonight: Greedy People (2024) for a surprising dark comedy, Old Henry (2021) for a western with an unexpected twist, Tetris (2023) for a fascinating true story, Dom Hemingway (2013) for a memorable acting performance, and Irresistible (2020) for an intelligent political comedy. Our recommended movie list is updated weekly."
        }
      }
    ]
  };

  return (
    <div className="bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-800">What Movie to Watch?</h1>
            <div className="flex justify-center">
              <span className="inline-block w-32 h-1 rounded bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"></span>
            </div>
          </header>
        
          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-6 rounded">
            <p className="text-sm text-indigo-800 font-medium">
              <strong>Last update: October 28, 2025</strong>
            </p>
          </div>

          <div className="mb-8">
            <p className="text-lg">
              Tired of scrolling endlessly through streaming platforms without finding what to watch? MovieHunt offers you a carefully curated selection of films to watch tonight.
            </p>
            
            <p className="text-lg">
              Each week, we select 5 must-see movies: hidden gems you might have missed, recent releases that deserve your attention, and timeless classics to (re)discover.
            </p>
            
            <p className="text-lg">
              Our recommendations are sincere and personal. No influence from studios or distributors, just our genuine passion for cinema and our desire to share exceptional films with you.
            </p>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-900 mb-3">🎃 Halloween Special</h3>
              <p className="text-gray-800 mb-3">
                Looking for scary movies for Halloween? Discover our selection of the best horror films of 2025!
              </p>
              <Link href="/en/halloween-horror-movies-2025" className="inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold">
                See Halloween horror movies →
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold mt-6 mb-4">Our Personalized Selection</h2>
            
            <p className="text-lg mb-4">
              Here are our 5 movie recommendations to watch this week, carefully selected for you:
            </p>
          </div>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommendation 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎭 For a surprising dark comedy:</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/greedy-people">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/qkmFPxiawqjGhxuC3HvN9sVuJbD.jpg" 
                      alt="Greedy People movie poster" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Greedy People (2024)</h3>
                <p className="my-3">
                  A murder, a million dollars, and a series of catastrophic decisions in a peaceful small town. Joseph Gordon-Levitt shines in this dark comedy full of twists.
                </p>
                <Link href="/films/greedy-people" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  See on MovieHunt →
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommendation 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🤠 For a western with an unexpected twist:</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/old-henry">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/eE1SL0QoDsvAMqQly56IkRtlN1W.jpg" 
                      alt="Old Henry movie poster" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Old Henry (2021)</h3>
                <p className="my-3">
                  A widowed farmer takes in an injured man with a satchel full of money. This intimate western hides a secret that will change everything. Tim Blake Nelson is masterful in this film that intelligently revisits the genre.
                </p>
                <Link href="/films/old-henry" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  See on MovieHunt →
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommendation 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">�� For a fascinating true story:</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/tetris">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/4F2QwcIxJWyEOkNhpNFoMT5HDXT.jpg" 
                      alt="Tetris movie poster" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Tetris (2023)</h3>
                <p className="my-3">
                  The incredible true story of how Tetris became a global phenomenon. A captivating thriller about the Cold War, international negotiations, and the most famous video game in history. Taron Egerton is excellent in this surprising film.
                </p>
                <Link href="/films/tetris" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  See on MovieHunt →
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommendation 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🎬 For a memorable acting performance:</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/dom-hemingway">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/6W6Kw3FLSfQqvYjvUlmQQGgCdNV.jpg" 
                      alt="Dom Hemingway movie poster" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Dom Hemingway (2013)</h3>
                <p className="my-3">
                  After 12 years in prison, a safecracker seeks his due. Jude Law delivers an explosive performance in this dark comedy where he's unrecognizable. A hidden gem that deserves to be discovered.
                </p>
                <Link href="/films/dom-hemingway" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  See on MovieHunt →
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* Recommendation 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold">🗳️ For an intelligent political comedy:</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <Link href="/films/irresistible">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src="https://image.tmdb.org/t/p/w342/4P3RbsnULvZ3kfpounUEkJualSl.jpg" 
                      alt="Irresistible movie poster" 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">🎥 Irresistible (2020)</h3>
                <p className="my-3">
                  A Democratic political consultant helps a retired colonel in a local election. A biting satire of the American electoral system with a brilliant final twist that changes everything.
                </p>
                <Link href="/films/irresistible" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  See on MovieHunt →
                </Link>
              </div>
            </div>
          </section>
          
          <hr className="my-8 border-gray-300" />
          
          {/* CTA Section */}
          <section className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Want more movie recommendations?</h2>
            <p className="text-lg mb-6">
              Explore our complete collection of rated and reviewed films. Each movie is analyzed with care to help you find your next favorite film.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/en/hidden-gems" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Discover hidden gems →
              </Link>
              <Link href="/en/top-rated" className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                See top rated films →
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
