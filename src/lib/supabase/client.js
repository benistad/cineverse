'use client';

import { getSupabaseClient } from './config';

// Export du client Supabase pour une utilisation côté client
export const supabase = getSupabaseClient();
