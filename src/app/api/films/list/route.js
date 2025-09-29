import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    // Récupérer tous les films avec leurs slugs
    const { data: films, error } = await supabase
      .from('films')
      .select('id, title, slug')
      .order('title');

    if (error) {
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Liste des films disponibles",
      count: films?.length || 0,
      films: films || []
    }, {
      headers: {
        'Cache-Control': 'public, max-age=1800', // Cache 30 minutes
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Erreur liste films:', error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
