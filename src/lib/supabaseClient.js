import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep app from crashing hard; you’ll see errors in the console when calls are attempted.
  console.warn('[supabaseClient] Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    flowType: 'pkce',          // Required for secure OAuth in SPAs (Supabase v2 default)
    detectSessionInUrl: true,  // Auto-processes the ?code= param after OAuth redirect
  },
});

