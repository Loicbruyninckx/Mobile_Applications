import type { AuthError, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import type { User } from '../types/User';

async function toAppUser(authUser: SupabaseUser): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', authUser.id)
    .maybeSingle();

  const metadataName: unknown = authUser.user_metadata.username;
  const fallbackName = typeof metadataName === 'string' ? metadataName : '';

  const username: unknown = error ? undefined : data?.username;
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    username: typeof username === 'string' ? username : fallbackName,
  };
}

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

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { username: cleanUsername } },
  });
  if (error) {
    throw toFriendlyError(error);
  }
  if (!data.user || !data.session) {
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

export async function getCurrentUser(): Promise<User | undefined> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    return undefined;
  }
  return toAppUser(data.session.user);
}

export function onSignedOut(callback: () => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      callback();
    }
  });
  return () => data.subscription.unsubscribe();
}
