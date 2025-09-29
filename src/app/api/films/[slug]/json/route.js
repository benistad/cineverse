import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Utiliser la clé publique pour l'accès en lecture seule
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Récupérer le film par son slug
    const { data: film, error } = await supabase
      .from('films')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !film) {
      // Si le slug n'existe pas, essayer de trouver par titre (fallback)
      const normalizedSlug = slug.replace(/-/g, ' ').toLowerCase();
      
      const { data: filmByTitle, error: titleError } = await supabase
        .from('films')
        .select('*')
        .ilike('title', `%${normalizedSlug}%`)
        .limit(1);

      if (titleError || !filmByTitle || filmByTitle.length === 0) {
        return NextResponse.json(
          { error: "Film not found" },
          { status: 404 }
        );
      }

      // Retourner le premier film trouvé
      return NextResponse.json(filmByTitle[0], {
        headers: {
          'Cache-Control': 'public, max-age=3600', // Cache 1 heure
          'Content-Type': 'application/json',
        },
      });
    }

    // Retourner le film trouvé par slug
    return NextResponse.json(film, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache 1 heure
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du film:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
