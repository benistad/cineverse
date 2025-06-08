import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Faire une requête simple pour compter le nombre de films
    const { count, error } = await supabase
      .from('films')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Erreur lors du ping Supabase:', error);
      return Response.json({ 
        success: false, 
        message: 'Échec du ping Supabase', 
        error: error.message 
      }, { status: 500 });
    }
    
    // Log pour le débogage
    console.log(`Ping Supabase réussi: ${new Date().toISOString()}`);
    
    return Response.json({ 
      success: true, 
      message: 'Ping Supabase réussi',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return Response.json({ 
      success: false, 
      message: 'Erreur inattendue', 
      error: error.message 
    }, { status: 500 });
  }
}
