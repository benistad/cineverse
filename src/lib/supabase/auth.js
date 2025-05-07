'use client';

import { createBrowserClient } from '@supabase/ssr';

// Création du client Supabase côté client - singleton pour éviter les instances multiples
let supabaseInstance = null;

const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  return supabaseInstance;
};

/**
 * Récupère la session courante
 */
export async function getSession() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return data.session;
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    return null;
  }
}

/**
 * Connexion avec email et mot de passe
 */
export async function signInWithEmail(email, password) {
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
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return data.user;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

// Exporte le client Supabase pour une utilisation directe
export { getSupabase };
