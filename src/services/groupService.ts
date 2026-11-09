import { supabase } from './supabaseClient';
import { GROUP_COLUMNS, readNestedRow, readOptionalNumber, readOptionalString, readString, toGroup, type Row } from './rowParsers';
import type { Group, GroupWithMemberCount, JoinGroupResult } from '../types/Group';
import type { GroupMemberWithProfile } from '../types/GroupMember';

export const GROUP_NAME_MAX = 50;
export const INVITE_CODE_LENGTH = 6;

function readMemberCount(row: Row): number {
  const value = row.group_members;
  if (!Array.isArray(value)) return 0;
  const first: unknown = value[0];
  if (typeof first !== 'object' || !first) return 0;
  return readOptionalNumber(Object.fromEntries(Object.entries(first)), 'count') ?? 0;
}

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

export function normalizeInviteCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, INVITE_CODE_LENGTH);
}

async function findMembershipByCode(code: string): Promise<Group | undefined> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (userId === undefined) {
    throw new Error('Je bent niet ingelogd.');
  }

  const { data, error } = await supabase
    .from('groups')
    .select(`${GROUP_COLUMNS}, group_members!inner(user_id)`)
    .eq('invite_code', code)
    .eq('group_members.user_id', userId)
    .maybeSingle();
  if (error) {
    throw new Error('Joinen mislukt. Controleer je internetverbinding en probeer opnieuw.');
  }
  return data ? toGroup(data) : undefined;
}

export async function joinGroupByCode(code: string): Promise<JoinGroupResult> {
  const clean = normalizeInviteCode(code);
  if (clean.length !== INVITE_CODE_LENGTH) {
    throw new Error(`Een code heeft ${INVITE_CODE_LENGTH} tekens.`);
  }

  const existing = await findMembershipByCode(clean);
  if (existing !== undefined) {
    return { groupId: existing.id, groupName: existing.name, alreadyMember: true };
  }

  const { data, error } = await supabase.rpc('join_group_by_code', { code: clean });
  if (error) {
    if (error.code === 'P0002') {
      throw new Error('Deze code bestaat niet. Controleer of je hem juist overtypte.');
    }
    throw new Error('Joinen mislukt. Controleer je internetverbinding en probeer opnieuw.');
  }
  if (typeof data !== 'string') {
    throw new Error('Joinen mislukt. Probeer opnieuw.');
  }

  const group = await getGroup(data);
  return { groupId: group.id, groupName: group.name, alreadyMember: false };
}
