import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Utiliser la clé publique pour l'accès en lecture seule
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour nettoyer le HTML et extraire le texte
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
    .replace(/&nbsp;/g, ' ') // Remplacer les espaces insécables
    .replace(/&amp;/g, '&')  // Décoder les entités HTML
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Fonction pour transformer les données du film au format demandé
function transformFilmData(film, remarkableStaff = []) {
  const sections = [];
  
  // Section "Pourquoi le voir ?" 
  if (film.why_watch_enabled && film.why_watch_content) {
    sections.push({
      heading: "Pourquoi le voir ?",
      content: stripHtml(film.why_watch_content)
    });
  }
  
  // Section "Notre avis" (ce qu'on n'a pas aimé)
  if (film.not_liked_enabled && film.not_liked_content) {
    sections.push({
      heading: "Notre avis",
      content: stripHtml(film.not_liked_content)
    });
  }
  
  // Section "Casting" si on a du staff remarquable
  if (remarkableStaff && remarkableStaff.length > 0) {
    const castingText = remarkableStaff
      .map(person => `${person.nom} (${person.role})`)
      .join(', ');
    
    sections.push({
      heading: "Casting",
      content: castingText
    });
  }
  
  // Préparer les genres comme array
  let genresArray = [];
  if (film.genres) {
    genresArray = film.genres.split(',').map(genre => genre.trim());
  }
  
  // Extraire l'année de release_date
  let year = null;
  if (film.release_date) {
    year = new Date(film.release_date).getFullYear();
  }
  
  // Construire l'objet de réponse
  const response = {
    title: film.title,
    slug: film.slug,
    score: film.note_sur_10,
    hunted: Boolean(film.is_hunted_by_moviehunt),
    hidden_gem: Boolean(film.is_hidden_gem),
    sections: sections
  };
  
  // Ajouter les champs optionnels seulement s'ils existent
  if (genresArray.length > 0) {
    response.genres = genresArray;
  }
  
  if (year) {
    response.year = year;
  }
  
  // Note: runtime n'est pas disponible dans la base actuelle
  // Il faudrait l'ajouter depuis TMDB si nécessaire
  
  return response;
}

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
    let { data: film, error } = await supabase
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

      // Utiliser le premier film trouvé
      film = filmByTitle[0];
    }
    
    // Récupérer le staff remarquable séparément
    const { data: remarkableStaff } = await supabase
      .from('remarkable_staff')
      .select('nom, role')
      .eq('film_id', film.id);

    // Transformer les données au format demandé
    const transformedData = transformFilmData(film, remarkableStaff);

    return NextResponse.json(transformedData, {
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

// Méthodes non autorisées
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
