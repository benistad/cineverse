/**
 * API Route pour traduire automatiquement un film
 * Appelé automatiquement lors de l'ajout/modification d'un film
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { translateFilmContent, isDeepLConfigured } from '@/lib/translation/deepl';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    // Vérifier la configuration
    if (!isDeepLConfigured()) {
      return NextResponse.json(
        { error: 'DeepL API key not configured' },
        { status: 500 }
      );
    }

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
      .select('id, title, synopsis, why_watch_content, what_we_didnt_like')
      .eq('id', filmId)
      .single();

    if (fetchError || !film) {
      return NextResponse.json(
        { error: 'Film not found' },
        { status: 404 }
      );
    }

    // 2. Traduire le contenu
    console.log(`Translating film: ${film.title}`);
    const translations = await translateFilmContent(film);

    // 3. Sauvegarder les traductions
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

    console.log(`✅ Film translated successfully: ${film.title}`);

    return NextResponse.json({
      success: true,
      filmId: film.id,
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
