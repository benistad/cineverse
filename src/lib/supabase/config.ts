'use client';

import { createBrowserClient } from '@supabase/ssr';

// Fonction pour créer un client Supabase côté client
// Cette approche évite de créer plusieurs instances du client
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Types pour les tables Supabase
export type Tables = {
  films: {
    Row: {
      id: string;
      tmdb_id: number;
      title: string;
      slug: string;
      synopsis: string;
      poster_url: string | null;
      backdrop_url: string | null;
      note_sur_10: number;
      youtube_trailer_key: string | null;
      date_ajout: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      tmdb_id: number;
      title: string;
      slug: string;
      synopsis: string;
      poster_url?: string | null;
      backdrop_url?: string | null;
      note_sur_10: number;
      youtube_trailer_key?: string | null;
      date_ajout?: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      tmdb_id?: number;
      title?: string;
      slug?: string;
      synopsis?: string;
      poster_url?: string | null;
      backdrop_url?: string | null;
      note_sur_10?: number;
      youtube_trailer_key?: string | null;
      date_ajout?: string;
      created_at?: string;
    };
  };
  remarkable_staff: {
    Row: {
      id: string;
      film_id: string;
      nom: string;
      role: string;
      photo_url: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      film_id: string;
      nom: string;
      role: string;
      photo_url?: string | null;
      created_at?: string;
    };
    Update: {
      id?: string;
      film_id?: string;
      nom?: string;
      role?: string;
      photo_url?: string | null;
      created_at?: string;
    };
  };
};
