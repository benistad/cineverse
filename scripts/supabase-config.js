/**
 * Configuration pour la migration Supabase
 * Contient les informations de connexion pour les deux instances
 */

export const SOURCE_SUPABASE = {
  url: 'https://ynumbbsdniheeqktblyq.supabase.co', // URL de votre instance source (USA)
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludW1iYnNkbmloZWVxa3RibHlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjYyMDQ3NCwiZXhwIjoyMDYyMTk2NDc0fQ.IliW3hcB4RNQwD6mXzkRaIc4C7usCcz3-xd5_fL87lU' // Clé de service de votre instance source
};

export const DESTINATION_SUPABASE = {
  url: 'https://rqdzztobbwmffakqixar.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZHp6dG9iYndtZmZha3FpeGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzExMTIzOCwiZXhwIjoyMDYyNjg3MjM4fQ.KAcgzUUVcYJ6QCKp0f0TleUpMGo8mJfQXqRnfcIktzI'
};

// Liste des tables à migrer (dans l'ordre)
export const TABLES_TO_MIGRATE = [
  'genres',           // Pas de dépendances
  'staff_members',    // Pas de dépendances
  'films',            // Peut avoir des références aux genres
  'staff_picks',      // Dépend de films et staff_members
  // Ajoutez ici toutes vos autres tables
];
