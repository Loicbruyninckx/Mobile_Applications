import { supabase } from './supabaseClient';
import { GROUP_COLUMNS, toGroup } from './rowParsers';
import type { Group } from '../types/Group';

/** Alle groepen waar je lid van bent (RLS filtert de rest weg), alfabetisch. */
export async function getMyGroups(): Promise<Group[]> {
  const { data, error } = await supabase.from('groups').select(GROUP_COLUMNS).order('name');
  if (error) {
    throw new Error('Je groepen konden niet geladen worden.');
  }
  return data.map(toGroup);
}
