import { createClient } from '@supabase/supabase-js';

// Expo vervangt EXPO_PUBLIC_-variabelen tijdens het bouwen door hun waarde uit .env.
// Ze moeten daarom letterlijk zo uitgeschreven staan (niet via process.env[naam]).
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl === undefined || supabaseAnonKey === undefined) {
  throw new Error(
    'Supabase-config ontbreekt: vul EXPO_PUBLIC_SUPABASE_URL en EXPO_PUBLIC_SUPABASE_ANON_KEY in .env in en herstart Expo.',
  );
}

/**
 * Eén gedeelde Supabase-client voor alle services.
 * In de browser bewaart Supabase de sessie in localStorage, zodat je na een refresh
 * ingelogd blijft. Tijdens de statische build (geen browser) gebruikt hij geheugen.
 * Voor de native app (opdracht 2) geven we hier AsyncStorage mee als `auth.storage`.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
