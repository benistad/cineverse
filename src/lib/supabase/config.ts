import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérification de la présence des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
