import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Teen Movie Ideas: 10 Must-Watch Films to Discover | MovieHunt',
  description: 'Discover our selection of teen movie ideas: action films, comedies, dramas and thrillers perfect for teenagers. Complete guide with recommendations and where to watch them.',
  keywords: 'teen movie ideas, movies for teenagers, teen films, what to watch teens, youth movies, teen movie recommendations, best teen movies, must-watch teen films',
  openGraph: {
    title: 'Teen Movie Ideas: 10 Must-Watch Films',
    description: 'Selection of perfect films for teenagers: action, comedy, drama and thriller.',
    type: 'article',
    url: 'https://www.moviehunt.fr/en/teen-movie-ideas',
  },
  alternates: {
    canonical: 'https://www.moviehunt.fr/en/teen-movie-ideas',
    languages: {
      'fr': 'https://www.moviehunt.fr/idees-films-pour-ados',
      'en': 'https://www.moviehunt.fr/en/teen-movie-ideas',
    },
  },
};

export default function TeenMovieIdeas() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Teen Movie Ideas: 10 Must-Watch Films to Discover",
            "description": "Complete guide to the best films for teenagers with recommendations by genre",
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
              "@id": "https://www.moviehunt.fr/en/teen-movie-ideas"
            }
          })
        }}
      />

      {/* Header with image */}
      <header className="mb-12">
        <div className="relative w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src="/images/blog/idee-film-pour-ado.jpg"
            alt="Teen movie ideas: 10 must-watch films to discover for teenagers"
            width={1536}
            height={1024}
            priority
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
              Teen Movie Ideas
            </h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
              10 must-watch films to discover
            </p>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="mb-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-gray-800 mb-6">
            Looking for a <strong className="text-indigo-700">teen movie idea</strong> that's a bit off the beaten path? 
            Whether you want to think, laugh or experience a great adventure, some films leave a lasting impression 
            when discovered during adolescence.
          </p>
          
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            The <strong className="text-indigo-700">MovieHunt</strong> team has selected <strong>10 must-watch films</strong>: 
            6 cult classics every teen should see, and 4 hidden gems to discover. 
            Films that speak about identity, freedom, courage and becoming yourself.
          </p>

          <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-600 shadow-md mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 mb-3 flex items-center">
              <span className="text-3xl mr-3">📝</span>
              Full article on our blog
            </h2>
            <p className="text-gray-700 mb-4">
              On the <strong>MovieHunt blog</strong>, find the detailed analysis of these 10 films with:
            </p>
            <ul className="text-gray-700 mb-4 space-y-2">
              <li>✨ <strong>6 must-watch films</strong>: The Truman Show, Ready Player One, Dead Poets Society, Mean Girls, The Perks of Being a Wallflower, The Hunger Games</li>
              <li>🔍 <strong>4 hidden gems</strong>: The Way Way Back, Sing Street, The Spectacular Now, Chronicle</li>
              <li>📺 Streaming platforms where to watch them</li>
              <li>💡 Tips to choose according to your mood</li>
            </ul>
            <Link 
              href="https://www.moviehunt-blog.fr/article/idee-de-film-pour-ado-10-films-incontournables"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Read the full article on the blog
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

      {/* Why this selection */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Why this selection of teen films?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              Targeted selection
            </h3>
            <p className="text-gray-700">
              From classics like <strong>The Truman Show</strong> and <strong>Dead Poets Society</strong> 
              to gems like <strong>Sing Street</strong> and <strong>Chronicle</strong>, these films address 
              universal themes: the quest for identity, social pressure, courage, friendship and dreams.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">⭐</span>
              Quality guaranteed
            </h3>
            <p className="text-gray-700">
              From <strong>Mean Girls</strong> to <strong>The Hunger Games</strong>, through <strong>Ready Player One</strong> 
              and <strong>The Perks of Being a Wallflower</strong>, each film has been chosen for its ability to leave 
              a lasting impression on teenage viewers.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500">
            <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">🎬</span>
              Genre diversity
            </h3>
            <p className="text-gray-700">
              Whether you're looking for a film to <strong>think</strong> (The Truman Show, Chronicle), 
              to <strong>laugh</strong> (Mean Girls, The Way Way Back), for <strong>adventure</strong> 
              (Ready Player One, The Hunger Games) or for <strong>emotion</strong> (The Perks of Being a Wallflower, Sing Street), 
              this selection has everything you need.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-yellow-500">
            <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center">
              <span className="text-2xl mr-3">💡</span>
              Educational approach
            </h3>
            <p className="text-gray-700">
              These films are not mere entertainment: they raise questions about who we really are, 
              how to stay true to ourselves in the face of social pressure, and how to dare to defend our values. 
              Perfect for a night with friends or a moment of reflection.
            </p>
          </div>
        </div>
      </section>

      {/* Important note */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border-l-4 border-amber-500 shadow-lg">
          <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">ℹ️</span>
            About this selection
          </h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            <strong>Important:</strong> MovieHunt usually focuses on arthouse films 
            and hidden gems. This special teen selection therefore mixes mainstream classics 
            (<strong>Mean Girls</strong>, <strong>The Hunger Games</strong>, <strong>Ready Player One</strong>) 
            and more confidential films (<strong>The Way Way Back</strong>, <strong>Sing Street</strong>, 
            <strong>The Spectacular Now</strong>).
          </p>
          <p className="text-gray-800 leading-relaxed mb-4">
            Result: <strong className="text-amber-800">not all these films are necessarily present 
            on MovieHunt.fr</strong>, as some are blockbusters that we don't systematically cover 
            in our usual reviews. But they all deserve to be discovered!
          </p>
          <p className="text-gray-800 leading-relaxed">
            This list remains a <strong className="text-amber-800">serious recommendation from the MovieHunt team</strong>, 
            designed to offer teens a rich and varied cinematic journey. Films that speak 
            about growing up, doubting, dreaming and becoming yourself.
          </p>
        </div>
      </section>

      {/* Genres covered */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Teen film genres covered
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '💥', genre: 'Action', desc: 'Thrilling action films' },
            { emoji: '😂', genre: 'Comedy', desc: 'Light and funny comedies' },
            { emoji: '🎭', genre: 'Drama', desc: 'Touching and deep dramas' },
            { emoji: '🔍', genre: 'Thriller', desc: 'Captivating thrillers' },
            { emoji: '🚀', genre: 'Sci-Fi', desc: 'Sci-fi and futuristic worlds' },
            { emoji: '❤️', genre: 'Romance', desc: 'Teen love stories' },
            { emoji: '🎓', genre: 'Coming-of-age', desc: 'Passage to adulthood' },
            { emoji: '🌟', genre: 'Adventure', desc: 'Epic adventures' },
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

      {/* Discover more */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to discover more films?
          </h2>
          <p className="text-lg md:text-xl mb-6 text-indigo-100">
            On MovieHunt, we offer hundreds of carefully selected film reviews, rated according to 5 precise 
            criteria and accompanied by personalized recommendations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/en"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300"
            >
              Discover all our films
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SEO */}
      <section className="mb-12">
        {/* Schema.org JSON-LD for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the best teen movie on Netflix?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mean Girls and The Perks of Being a Wallflower are excellent choices available on Netflix. They mix humor, emotion and reflection."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What teen movies are on Disney+?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ready Player One is available via Star on Disney+. It's an epic adventure perfect for young gamers, with spectacular visual effects."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What film for a shy teenager?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Perks of Being a Wallflower and The Way Way Back are perfect for introverted teens. They speak about finding your place and accepting yourself with rare sincerity."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What action film for teenagers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Hunger Games and Ready Player One offer spectacular action while addressing deep themes like resistance and freedom."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What film for a teen who loves music?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sing Street is the ideal choice! A touching musical film with an irresistible soundtrack set in 1980s Dublin."
                  }
                }
              ]
            })
          }}
        />
        
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 border-b-4 border-indigo-600 pb-3">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              What is the best teen movie on Netflix?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Mean Girls</strong> and <strong>The Perks of Being a Wallflower</strong> are excellent choices 
              available on Netflix. They mix humor, emotion and reflection. Check our blog article 
              for the complete availability of all films.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              What teen movies are on Disney+?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Ready Player One</strong> is available via Star on Disney+. It's an epic 
              adventure perfect for young gamers, with spectacular visual effects and a story 
              that raises relevant questions about our relationship with the virtual.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              What film for a shy teenager?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>The Perks of Being a Wallflower</strong> and <strong>The Way Way Back</strong> are perfect for 
              introverted teens. They speak about finding your place and accepting yourself with rare sincerity. 
              These comfort films touch the heart.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              What action film for teenagers?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>The Hunger Games</strong> and <strong>Ready Player One</strong> offer 
              spectacular action while addressing deep themes like resistance, media manipulation 
              and the thirst for freedom.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <summary className="font-bold text-lg text-indigo-900 cursor-pointer">
              What film for a teen who loves music?
            </summary>
            <p className="mt-4 text-gray-700">
              <strong>Sing Street</strong> is the ideal choice! A touching musical film with an 
              irresistible soundtrack. In 1980s Dublin, a teen starts a band to impress a girl. 
              Perfect for those who dream of freedom and creation.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
