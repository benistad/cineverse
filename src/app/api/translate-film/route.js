/**
 * API Route pour traduire automatiquement un film
 * Utilise TMDB pour les titres originaux et synopsis officiels
 * Utilise DeepL uniquement pour le contenu custom
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTFmYzFkODkzNTExZjgwYTBjNmI0YzRkZTE2MWM1MSIsIm5iZiI6MTc0NjUxNTA1NC4yODE5OTk4LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hj-9KXl-h5-7CtFhFSC6V4NJE__c1ozx5OnrETtCS9c';
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

/**
 * Récupère les données TMDB en anglais
 */
async function getTmdbDataInEnglish(tmdbId) {
  if (!tmdbId) return null;

  try {
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/${tmdbId}?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data.original_title || data.title,
      synopsis: data.overview || ''
    };
  } catch (error) {
    console.error('Error fetching TMDB data:', error);
    return null;
  }
}

/**
 * Traduit avec DeepL
 */
async function translateWithDeepL(text) {
  if (!text || text.trim() === '' || !DEEPL_API_KEY) {
    return text;
  }

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        auth_key: DEEPL_API_KEY,
        text: text,
        source_lang: 'FR',
        target_lang: 'EN-US',
        formality: 'default',
        preserve_formatting: '1'
      })
    });

    if (!response.ok) return text;

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Error translating with DeepL:', error);
    return text;
  }
}

export async function POST(request) {
  try {
    const { filmId } = await request.json();

    if (!filmId) {
      return NextResponse.json(
        { error: 'Film ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Récupérer le film
    const { data: film, error: fetchError } = await supabase
      .from('films')
      .select('id, tmdb_id, title, synopsis, why_watch_content')
      .eq('id', filmId)
      .single();

    if (fetchError || !film) {
      return NextResponse.json(
        { error: 'Film not found' },
        { status: 404 }
      );
    }

    console.log(`Translating film (enhanced): ${film.title}`);

    const translations = {
      title: '',
      synopsis: '',
      why_watch_content: ''
    };

    let source = 'deepl';

    // 2. Essayer TMDB d'abord
    if (film.tmdb_id) {
      const tmdbData = await getTmdbDataInEnglish(film.tmdb_id);
      
      if (tmdbData && tmdbData.title) {
        translations.title = tmdbData.title;
        translations.synopsis = tmdbData.synopsis || '';
        source = 'tmdb';
        console.log(`  ✅ TMDB: Got title and synopsis`);
      }
    }

    // 3. Fallback sur DeepL si nécessaire
    if (!translations.title) {
      translations.title = await translateWithDeepL(film.title);
      translations.synopsis = await translateWithDeepL(film.synopsis || '');
      console.log(`  ⚡ DeepL: Translated title and synopsis`);
    }

    // 4. Toujours traduire le contenu custom avec DeepL
    if (film.why_watch_content) {
      translations.why_watch_content = await translateWithDeepL(film.why_watch_content);
      console.log(`  ⚡ DeepL: Translated why_watch_content`);
    }

    // 5. Sauvegarder les traductions
    const { error: insertError } = await supabase
      .from('film_translations')
      .upsert({
        film_id: film.id,
        locale: 'en',
        ...translations
      }, {
        onConflict: 'film_id,locale'
      });

    if (insertError) {
      console.error('Error saving translations:', insertError);
      return NextResponse.json(
        { error: 'Failed to save translations' },
        { status: 500 }
      );
    }

    console.log(`✅ Film translated successfully: ${film.title} (source: ${source})`);

    return NextResponse.json({
      success: true,
      filmId: film.id,
      source,
      translations
    });

  } catch (error) {
    console.error('Error in translate-film API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint pour vérifier si un film est traduit
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filmId = searchParams.get('filmId');

    if (!filmId) {
      return NextResponse.json(
        { error: 'Film ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('film_translations')
      .select('*')
      .eq('film_id', filmId)
      .eq('locale', 'en')
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      translated: !!data,
      translation: data || null
    });

  } catch (error) {
    console.error('Error checking translation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
