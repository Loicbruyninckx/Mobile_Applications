/// <reference types="cypress" />
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { E2E_REVIEWS, FEED_REVIEW, TEST_BEER_NAME, TESTGROEP_CODE, type TestContext } from '../support/testData';

interface Credentials {
  email: string;
  password: string;
}

interface SignedIn {
  client: SupabaseClient;
  userId: string;
}

type TestUser = 'test1' | 'test2';

function readEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const values: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf-8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    values[key] = value;
  }
  return values;
}

function requireValue(source: Record<string, unknown>, key: string, where: string): string {
  const value = source[key];
  if (typeof value !== 'string' || value === '') {
    throw new Error(`${key} ontbreekt in ${where}.`);
  }
  return value;
}

function readId(row: unknown): string {
  if (typeof row === 'object' && row && 'id' in row && typeof row.id === 'string') {
    return row.id;
  }
  throw new Error('Supabase gaf een rij zonder id terug.');
}

export function registerSupabaseTasks(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void {
  const dotEnv = { ...readEnvFile(join(config.projectRoot, '.env')), ...process.env };
  const supabaseUrl = requireValue(dotEnv, 'EXPO_PUBLIC_SUPABASE_URL', '.env');
  const supabaseAnonKey = requireValue(dotEnv, 'EXPO_PUBLIC_SUPABASE_ANON_KEY', '.env');

  const env: Record<string, unknown> = config.env;
  const users: Record<TestUser, Credentials> = {
    test1: {
      email: requireValue(env, 'TEST1_EMAIL', 'cypress.env.json'),
      password: requireValue(env, 'TEST1_PASSWORD', 'cypress.env.json'),
    },
    test2: {
      email: requireValue(env, 'TEST2_EMAIL', 'cypress.env.json'),
      password: requireValue(env, 'TEST2_PASSWORD', 'cypress.env.json'),
    },
  };

  const sessions = new Map<TestUser, Promise<SignedIn>>();

  async function doSignIn(user: TestUser): Promise<SignedIn> {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client.auth.signInWithPassword(users[user]);
    if (error || !data.user) {
      throw new Error(`Inloggen als ${user} mislukt: ${error?.message ?? 'geen gebruiker'}`);
    }
    return { client, userId: data.user.id };
  }

  function signIn(user: TestUser): Promise<SignedIn> {
    const cached = sessions.get(user);
    if (cached !== undefined) return cached;
    const attempt = doSignIn(user);
    sessions.set(user, attempt);
    attempt.catch(() => sessions.delete(user));
    return attempt;
  }

  async function getTestgroepId(): Promise<string> {
    const { client } = await signIn('test1');
    const { data, error } = await client.from('groups').select('id').eq('invite_code', TESTGROEP_CODE).maybeSingle();
    if (error || !data) {
      throw new Error('Testgroep niet gevonden. Voer supabase/seed.sql uit in de SQL Editor.');
    }
    return readId(data);
  }

  on('task', {
    async getTestContext(): Promise<TestContext> {
      const [groupId, test1, test2] = await Promise.all([getTestgroepId(), signIn('test1'), signIn('test2')]);
      return { groupId, test1Id: test1.userId, test2Id: test2.userId };
    },

    async countTest1Ratings(): Promise<number> {
      const { client, userId } = await signIn('test1');
      const { count, error } = await client
        .from('ratings')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (error) throw new Error(`Ratings tellen mislukt: ${error.message}`);
      return count ?? 0;
    },

    async deleteE2eRatings(): Promise<number> {
      const { client, userId } = await signIn('test1');
      const { data, error } = await client
        .from('ratings')
        .delete()
        .eq('user_id', userId)
        .in('review', E2E_REVIEWS)
        .select('id');
      if (error) throw new Error(`Testratings opruimen mislukt: ${error.message}`);
      return data.length;
    },

    async createFeedRating(): Promise<string> {
      const { client } = await signIn('test1');
      const groupId = await getTestgroepId();

      const { data: beer, error: beerError } = await client
        .from('beers')
        .select('id')
        .ilike('name', TEST_BEER_NAME)
        .limit(1)
        .maybeSingle();
      if (beerError || !beer) {
        throw new Error('Testbier niet gevonden. Voer supabase/seed.sql uit in de SQL Editor.');
      }

      const { data: rating, error: ratingError } = await client
        .from('ratings')
        .insert({ beer_id: readId(beer), score: 5, review: FEED_REVIEW })
        .select('id')
        .single();
      if (ratingError) throw new Error(`Feed-rating maken mislukt: ${ratingError.message}`);
      const ratingId = readId(rating);

      const { error: shareError } = await client.from('rating_shares').insert({ rating_id: ratingId, group_id: groupId });
      if (shareError) throw new Error(`Feed-rating delen mislukt: ${shareError.message}`);
      return ratingId;
    },

    async joinTestgroep(): Promise<boolean> {
      const { client } = await signIn('test2');
      const { error } = await client.rpc('join_group_by_code', { code: TESTGROEP_CODE });
      if (error) throw new Error(`test2 kon Testgroep niet joinen: ${error.message}`);
      return true;
    },

    async leaveTestgroep(): Promise<boolean> {
      const groupId = await getTestgroepId();
      const { client, userId } = await signIn('test2');
      const { error } = await client.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
      if (error) throw new Error(`test2 kon Testgroep niet verlaten: ${error.message}`);
      return true;
    },
  });
}
