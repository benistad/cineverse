import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API endpoint pour récupérer les données des films pour le sitemap
 * @returns {Promise<NextResponse>} Réponse contenant les données des films
 */
export async function GET() {
  try {
    // Créer un client Supabase côté serveur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    // Récupérer tous les films avec les informations minimales nécessaires pour le sitemap
    const { data: films, error } = await supabase
      .from('films')
      .select('id, slug, title, date_ajout')
      .order('date_ajout', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des films pour le sitemap:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des films' }, { status: 500 });
    }
    
    // Retourner les données des films
    return NextResponse.json(films);
  } catch (error) {
    console.error('Erreur serveur lors de la récupération des films pour le sitemap:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
