'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const MOODS = [
  { id: 'feelgood', emoji: '😄', label: 'Feel good', desc: 'Envie de sourire' },
  { id: 'suspense', emoji: '😱', label: 'Suspense', desc: 'Envie de frissonner' },
  { id: 'reflexion', emoji: '🧠', label: 'Réflexion', desc: 'Envie de réfléchir' },
  { id: 'emotion', emoji: '💔', label: 'Émotion', desc: 'Envie de pleurer' },
];

const DURATIONS = [
  { id: 'short', emoji: '⏱️', label: 'Moins de 1h30', max: 90 },
  { id: 'medium', emoji: '⏱️', label: 'Environ 2h', min: 90, max: 130 },
  { id: 'any', emoji: '⏱️', label: 'Peu importe', min: 0 },
];

function formatRuntime(minutes) {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

export default function TrouverUnFilmContent() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);
  const resultsRef = useRef(null);
  const durationRef = useRef(null);

  // Fetch films from API
  useEffect(() => {
    async function fetchFilms() {
      try {
        const res = await fetch('/api/films-recommander');
        const data = await res.json();
        setFilms(data);
      } catch (error) {
        console.error('Erreur chargement films:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFilms();
  }, []);

  // Scroll to duration section when mood is selected
  useEffect(() => {
    if (selectedMood && durationRef.current) {
      setTimeout(() => {
        durationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [selectedMood]);

  // Filter films when both selections are made
  useEffect(() => {
    if (!selectedMood || !selectedDuration) return;

    const durationConfig = DURATIONS.find(d => d.id === selectedDuration);

    // Filter by mood
    let filtered = films.filter(f => f.moods.includes(selectedMood));

    // Filter by duration
    if (durationConfig && selectedDuration !== 'any') {
      filtered = filtered.filter(f => {
        if (!f.duration) return true; // Include films without runtime info
        if (durationConfig.max && f.duration > durationConfig.max) return false;
        if (durationConfig.min && f.duration < durationConfig.min) return false;
        return true;
      });
    }

    // Sort by rating (best first)
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    // If not enough results, add fallback films from the same mood
    if (filtered.length < 3) {
      const fallback = films
        .filter(f => f.moods.includes(selectedMood) && !filtered.find(r => r.slug === f.slug))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
      filtered = [...filtered, ...fallback].slice(0, 3);
    }

    // Take top 3
    setResults(filtered.slice(0, 3));
    setShowResults(true);
    setAnimateResults(false);

    setTimeout(() => {
      setAnimateResults(true);
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [selectedMood, selectedDuration, films]);

  const handleReset = () => {
    setSelectedMood(null);
    setSelectedDuration(null);
    setResults([]);
    setShowResults(false);
    setAnimateResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-6">
            <span className="text-3xl">🎬</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Trouver un film en 30 secondes
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium">
            Choisis ton humeur, on s'occupe du reste
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">

        {/* STEP 1 — MOOD */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold">1</span>
            <h2 className="text-2xl font-bold text-gray-900">Quelle est ton humeur ?</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                onClick={() => {
                  setSelectedMood(mood.id);
                  setSelectedDuration(null);
                  setShowResults(false);
                }}
                className={`relative group flex flex-col items-center justify-center p-5 md:p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                  ${selectedMood === mood.id
                    ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100 scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                  }`}
              >
                <span className="text-4xl md:text-5xl mb-2 transition-transform duration-200 group-hover:scale-110">
                  {mood.emoji}
                </span>
                <span className="font-bold text-gray-900 text-base md:text-lg">{mood.label}</span>
                <span className="text-xs text-gray-400 mt-0.5">{mood.desc}</span>
                {selectedMood === mood.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* STEP 2 — DURATION */}
        {selectedMood && (
          <section className="mb-10" ref={durationRef}>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold">2</span>
              <h2 className="text-2xl font-bold text-gray-900">Combien de temps ?</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {DURATIONS.map(dur => (
                <button
                  key={dur.id}
                  onClick={() => setSelectedDuration(dur.id)}
                  className={`group flex flex-col items-center justify-center p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                    ${selectedDuration === dur.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100 scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                    }`}
                >
                  <span className="text-2xl mb-1">{dur.emoji}</span>
                  <span className="font-semibold text-gray-900 text-sm md:text-base text-center leading-tight">{dur.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* LOADING */}
        {selectedMood && selectedDuration && loading && (
          <div className="text-center py-12">
            <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Recherche en cours...</p>
          </div>
        )}

        {/* STEP 3 — RESULTS */}
        {showResults && !loading && (
          <section ref={resultsRef} className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold">3</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {results.length > 0 ? 'Nos recommandations' : 'Aucun résultat'}
                </h2>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Recommencer
              </button>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <span className="text-4xl mb-3 block">🤔</span>
                <p className="text-gray-600 font-medium">Aucun film ne correspond exactement à tes critères.</p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((film, index) => (
                  <div
                    key={film.slug}
                    className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300
                      ${animateResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${index * 120}ms` }}
                  >
                    <div className="flex items-start p-4 md:p-5 gap-4">
                      {/* Poster */}
                      {film.poster_url && (
                        <Link href={`/films/${film.slug}`} className="flex-shrink-0">
                          <img
                            src={film.poster_url}
                            alt={`Affiche ${film.title}`}
                            className="w-20 h-28 md:w-24 md:h-36 object-cover rounded-xl shadow-md"
                            loading="lazy"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </Link>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/films/${film.slug}`} className="hover:text-indigo-700 transition-colors">
                              <h3 className="font-bold text-lg md:text-xl text-gray-900 leading-tight">
                                {film.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                              {film.year && <span>{film.year}</span>}
                              {film.duration && (
                                <>
                                  <span>•</span>
                                  <span>{formatRuntime(film.duration)}</span>
                                </>
                              )}
                              {film.genres && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{film.genres.split(',')[0].trim()}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Rating badge */}
                          {film.rating && (
                            <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 border-2 border-yellow-400 shadow">
                              <span className="text-white font-bold text-sm">{film.rating}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{film.description}</p>

                        <Link
                          href={`/films/${film.slug}`}
                          className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          Voir le film
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* PREMIUM BLOCK */}
        {showResults && results.length > 0 && (
          <section className="mb-12">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 md:p-10 text-white shadow-2xl text-center">
              <span className="text-4xl mb-3 block">⚡</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Tu veux aller plus loin ?
              </h2>
              <p className="text-indigo-100 text-base md:text-lg mb-6 max-w-lg mx-auto">
                Découvre tous nos films notés et triés par genre, note et ambiance sur MovieHunt.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/all-films"
                  className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Voir tous les films
                </Link>
                <Link
                  href="/quel-film-regarder"
                  className="px-6 py-3 bg-yellow-400 text-indigo-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg"
                >
                  Guide complet
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* SEO TEXT */}
        <section className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Comment ça marche ?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Notre outil de <strong>recommandation de films</strong> vous aide à <strong>trouver un film rapidement</strong>, 
            sans passer 30 minutes à hésiter. Choisissez votre humeur du moment et votre temps disponible : 
            nous affichons instantanément <strong>3 films triés par note</strong> parmi les centaines de films 
            évalués par l'équipe MovieHunt.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Chaque film recommandé provient de notre base de données, enrichie à chaque nouvelle critique publiée. 
            Les résultats sont <strong>toujours à jour</strong> et classés par qualité selon notre <Link href="/comment-nous-notons-les-films" className="text-indigo-600 hover:text-indigo-800 font-semibold">système de notation</Link>.
          </p>
        </section>

      </main>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Trouver un Film en 30 Secondes - MovieHunt",
            "description": "Outil de recommandation de films instantané basé sur l'humeur et le temps disponible",
            "url": "https://www.moviehunt.fr/trouver-un-film",
            "applicationCategory": "Entertainment",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "author": {
              "@type": "Organization",
              "name": "MovieHunt"
            }
          })
        }}
      />
    </div>
  );
}
