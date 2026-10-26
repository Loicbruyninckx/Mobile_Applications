import type { AuthError, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import type { User } from '../types/User';

/** Haalt de username uit `profiles` (RLS laat je altijd je eigen profiel lezen). */
async function toAppUser(authUser: SupabaseUser): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) {
    throw new Error('Je profiel kon niet geladen worden. Probeer opnieuw.');
  }

  // Zonder gegenereerde database-types kent TypeScript de vorm van `data` niet: controleer zelf.
  const username: unknown = data?.username;
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    username: typeof username === 'string' ? username : '',
  };
}

/** Zet Supabase-fouten om naar begrijpelijke Nederlandse meldingen. */
function toFriendlyError(error: AuthError): Error {
  switch (error.code) {
    case 'invalid_credentials':
      return new Error('E-mail of wachtwoord klopt niet.');
    case 'user_already_exists':
    case 'email_exists':
      return new Error('Er bestaat al een account met dit e-mailadres.');
    case 'weak_password':
      return new Error('Kies een sterker wachtwoord (minstens 6 tekens).');
    case 'email_address_invalid':
      return new Error('Dit e-mailadres is ongeldig.');
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return new Error('Te veel pogingen. Wacht even en probeer opnieuw.');
    case 'unexpected_failure':
      // De trigger handle_new_user faalt als de username al bestaat (unique index).
      return new Error('Deze gebruikersnaam is al in gebruik.');
    default:
      return new Error('Er ging iets mis. Controleer je internetverbinding en probeer opnieuw.');
  }
}

export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    throw toFriendlyError(error);
  }
  return toAppUser(data.user);
}

export async function register(email: string, password: string, username: string): Promise<User> {
  const cleanUsername = username.trim();
  if (cleanUsername.length < 3 || cleanUsername.length > 30) {
    throw new Error('Je gebruikersnaam moet 3 tot 30 tekens lang zijn.');
  }

  // De username gaat mee als metadata; de database-trigger maakt er een profiel mee aan.
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { username: cleanUsername } },
  });
  if (error) {
    throw toFriendlyError(error);
  }
  if (!data.user || !data.session) {
    // Gebeurt alleen als "Confirm email" aan staat in Supabase.
    throw new Error('Bevestig eerst je e-mailadres via de mail die je kreeg en log dan in.');
  }
  return toAppUser(data.user);
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw toFriendlyError(error);
  }
}

/** Herstelt een bewaarde sessie bij het opstarten. Geeft undefined als niemand ingelogd is. */
export async function getCurrentUser(): Promise<User | undefined> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    return undefined;
  }
  return toAppUser(data.session.user);
}

/**
 * Roept `callback` aan wanneer de sessie eindigt buiten de app om
 * (verlopen, of uitgelogd in een ander tabblad). Geeft een functie terug om te stoppen met luisteren.
 */
export function onSignedOut(callback: () => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      callback();
    }
  });
  return () => data.subscription.unsubscribe();
}
