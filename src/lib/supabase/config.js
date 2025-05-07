'use client';

import { createBrowserClient } from '@supabase/ssr';

// Singleton pour le client Supabase
let supabaseInstance = null;

// Fonction pour créer un client Supabase côté client
// Cette approche évite de créer plusieurs instances du client
export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Les variables d\'environnement Supabase ne sont pas définies');
    return null;
  }
  
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}
