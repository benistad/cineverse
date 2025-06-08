import { createClient } from '@supabase/supabase-js';

// Configuration des instances Supabase
const supabaseInstances = [
  {
    name: 'Instance principale',
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
  {
    name: 'Instance secondaire (MovieHunt)',
    url: process.env.NEXT_PUBLIC_MOVIEHUNT_SUPABASE_URL || 'https://ynumbbsdniheeqktblyq.supabase.co',
    key: process.env.MOVIEHUNT_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_MOVIEHUNT_SUPABASE_ANON_KEY
  }
];

// Fonction pour pinger une instance Supabase
async function pingSupabaseInstance(instance) {
  if (!instance.url || !instance.key) {
    console.log(`Configuration manquante pour l'instance ${instance.name}`);
    return {
      name: instance.name,
      success: false,
      message: 'Configuration manquante (URL ou clé)',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const supabase = createClient(instance.url, instance.key);
    
    // Faire une requête simple pour compter le nombre de films
    const { count, error } = await supabase
      .from('films')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(`Erreur lors du ping de ${instance.name}:`, error);
      return {
        name: instance.name,
        success: false,
        message: `Échec du ping: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
    
    console.log(`Ping réussi pour ${instance.name}: ${new Date().toISOString()}`);
    return {
      name: instance.name,
      success: true,
      message: 'Ping réussi',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Erreur inattendue pour ${instance.name}:`, error);
    return {
      name: instance.name,
      success: false,
      message: `Erreur inattendue: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

export async function GET() {
  try {
    // Pinger toutes les instances configurées
    const results = await Promise.all(
      supabaseInstances.map(instance => pingSupabaseInstance(instance))
    );
    
    // Vérifier si au moins une instance a été pingée avec succès
    const anySuccess = results.some(result => result.success);
    
    return Response.json({
      success: anySuccess,
      message: anySuccess ? 'Au moins une instance Supabase a été pingée avec succès' : 'Échec du ping pour toutes les instances',
      results,
      timestamp: new Date().toISOString()
    }, { status: anySuccess ? 200 : 500 });
  } catch (error) {
    console.error('Erreur globale:', error);
    return Response.json({ 
      success: false, 
      message: 'Erreur globale inattendue', 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
