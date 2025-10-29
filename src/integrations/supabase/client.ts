import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

// Create Supabase client if environment variables are available
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Log warnings but don't throw errors - allows the app to run without Supabase
  if (!supabaseUrl) {
    console.warn('VITE_SUPABASE_URL não está definida nas variáveis de ambiente. Funcionalidades de banco de dados estarão desativadas.');
  }
  if (!supabaseAnonKey) {
    console.warn('VITE_SUPABASE_ANON_KEY não está definida nas variáveis de ambiente. Funcionalidades de banco de dados estarão desativadas.');
  }
}

export { supabase };
