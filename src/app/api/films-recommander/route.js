import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Mapping genres → moods
const MOOD_GENRE_MAP = {
  feelgood: ['Comédie', 'Animation', 'Famille', 'Musique', 'Aventure', 'Romance', 'Fantastique'],
  suspense: ['Thriller', 'Horreur', 'Mystère', 'Crime', 'Guerre'],
  reflexion: ['Science-Fiction', 'Documentaire', 'Histoire'],
  emotion: ['Drame', 'Romance', 'Guerre', 'Histoire'],
};

function getFilmMoods(genres) {
  if (!genres) return [];
  const genreList = genres.split(',').map(g => g.trim());
  const moods = new Set();
  
  for (const [mood, moodGenres] of Object.entries(MOOD_GENRE_MAP)) {
    for (const genre of genreList) {
      if (moodGenres.some(mg => genre.toLowerCase().includes(mg.toLowerCase()))) {
        moods.add(mood);
      }
    }
  }
  
  return Array.from(moods);
}

export async function GET() {
  try {
    const { data: films, error } = await supabase
      .from('films')
      .select('id, title, slug, synopsis, genres, note_sur_10, runtime, poster_url, release_date')
      .order('note_sur_10', { ascending: false });

    if (error) throw error;

    const enrichedFilms = (films || []).map(film => ({
      title: film.title,
      slug: film.slug,
      description: film.synopsis ? film.synopsis.substring(0, 120) + (film.synopsis.length > 120 ? '...' : '') : '',
      rating: film.note_sur_10,
      duration: film.runtime || null,
      moods: getFilmMoods(film.genres),
      genres: film.genres,
      poster_url: film.poster_url,
      year: film.release_date ? new Date(film.release_date).getFullYear() : null,
    }));

    return NextResponse.json(enrichedFilms, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching films for recommander:', error);
    return NextResponse.json([], { status: 500 });
  }
}
