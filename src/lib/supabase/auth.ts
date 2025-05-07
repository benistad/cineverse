'use client';

import { createBrowserClient } from '@supabase/ssr';

// Création du client Supabase côté client
const getSupabase = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
};

/**
 * Connexion avec email et mot de passe
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return { success: false, error };
  }
}

/**
 * Déconnexion
 */
export async function signOut() {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    return { success: false, error };
  }
}

/**
 * Récupère l'utilisateur courant côté client
 */
export async function getCurrentUser() {
  try {
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return user;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}
