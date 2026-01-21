import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client v3.2 (Dynamic Config)
 * Suporta chaves via .env ou via Instalador Automático.
 */

const getRuntimeConfig = () => {
  const stored = localStorage.getItem('ploutos_runtime_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const runtimeConfig = getRuntimeConfig();

const supabaseUrl = runtimeConfig?.supabaseUrl || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = runtimeConfig?.supabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;
