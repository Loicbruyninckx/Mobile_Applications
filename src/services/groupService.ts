import { supabase } from './supabaseClient';
import { GROUP_COLUMNS, readNestedRow, readOptionalNumber, readOptionalString, readString, toGroup, type Row } from './rowParsers';
import type { Group, GroupWithMemberCount } from '../types/Group';
import type { GroupMemberWithProfile } from '../types/GroupMember';

/** Zelfde regel als de check constraint in SQL: 1 tot 50 tekens. */
export const GROUP_NAME_MAX = 50;
export const INVITE_CODE_LENGTH = 6;

/** Leest het aantal uit `group_members(count)`: Supabase geeft dat als [{ count: 3 }]. */
function readMemberCount(row: Row): number {
  const value = row.group_members;
  if (!Array.isArray(value)) return 0;
  const first: unknown = value[0];
  if (typeof first !== 'object' || !first) return 0;
  return readOptionalNumber(Object.fromEntries(Object.entries(first)), 'count') ?? 0;
}

/** Alle groepen waar je lid van bent (RLS filtert de rest weg), alfabetisch, met het aantal leden. */
export async function getMyGroups(): Promise<GroupWithMemberCount[]> {
  const { data, error } = await supabase
    .from('groups')
    .select(`${GROUP_COLUMNS}, group_members(count)`)
    .order('name');
  if (error) {
    throw new Error('Je groepen konden niet geladen worden.');
  }
  return data.map((row: Row) => ({ ...toGroup(row), memberCount: readMemberCount(row) }));
}

/** Eén groep. Geeft een fout als de groep niet bestaat of je er geen lid van bent. */
export async function getGroup(groupId: string): Promise<Group> {
  const { data, error } = await supabase.from('groups').select(GROUP_COLUMNS).eq('id', groupId).maybeSingle();
  if (error) {
    throw new Error('De groep kon niet geladen worden.');
  }
  if (!data) {
    throw new Error('Deze groep bestaat niet of je bent er geen lid van.');
  }
  return toGroup(data);
}

/** Leden van een groep met hun username, in volgorde van joinen. */
export async function getGroupMembers(groupId: string): Promise<GroupMemberWithProfile[]> {
  const { data, error } = await supabase
    .from('group_members')
    .select('user_id, joined_at, profile:profiles(username, avatar_url)')
    .eq('group_id', groupId)
    .order('joined_at');
  if (error) {
    throw new Error('De leden konden niet geladen worden.');
  }
  return data.map((row: Row) => {
    const profile = readNestedRow(row, 'profile');
    return {
      userId: readString(row, 'user_id'),
      username: profile !== undefined ? readString(profile, 'username') : 'Onbekend',
      avatarUrl: profile !== undefined ? readOptionalString(profile, 'avatar_url') : undefined,
      joinedAt: readString(row, 'joined_at'),
    };
  });
}

/**
 * Maakt een groep. De database geeft ze zelf een unieke code van 6 tekens
 * (generate_invite_code) en maakt jou lid (trigger add_creator_as_member).
 */
export async function createGroup(name: string): Promise<Group> {
  const clean = name.trim();
  if (clean.length < 1 || clean.length > GROUP_NAME_MAX) {
    throw new Error(`Geef je groep een naam van 1 tot ${GROUP_NAME_MAX} tekens.`);
  }

  const { data, error } = await supabase.from('groups').insert({ name: clean }).select(GROUP_COLUMNS).single();
  if (error) {
    throw new Error('De groep kon niet aangemaakt worden. Controleer je internetverbinding.');
  }
  return toGroup(data);
}

/** Maakt van wat iemand typt een nette code: hoofdletters, geen spaties, max. 6 tekens. */
export function normalizeInviteCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, INVITE_CODE_LENGTH);
}

/**
 * Joint een groep met een uitnodigingscode via de databasefunctie join_group_by_code.
 * Al lid? Dan gebeurt er niets. Geeft het id van de groep terug.
 */
export async function joinGroupByCode(code: string): Promise<string> {
  const clean = normalizeInviteCode(code);
  if (clean.length !== INVITE_CODE_LENGTH) {
    throw new Error(`Een code heeft ${INVITE_CODE_LENGTH} tekens.`);
  }

  const { data, error } = await supabase.rpc('join_group_by_code', { code: clean });
  if (error) {
    // P0002 = "Ongeldige code" uit de SQL-functie.
    if (error.code === 'P0002') {
      throw new Error('Deze code bestaat niet. Controleer of je hem juist overtypte.');
    }
    throw new Error('Joinen mislukt. Controleer je internetverbinding en probeer opnieuw.');
  }
  if (typeof data !== 'string') {
    throw new Error('Joinen mislukt. Probeer opnieuw.');
  }
  return data;
}
