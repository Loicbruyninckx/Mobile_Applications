import type { Beer } from '../types/Beer';
import type { Cafe } from '../types/Cafe';
import type { Group } from '../types/Group';
import type { Rating, Score } from '../types/Rating';

export type Row = Record<string, unknown>;

export function readString(row: Row, key: string): string {
  const value = row[key];
  return typeof value === 'string' ? value : '';
}

export function readOptionalString(row: Row, key: string): string | undefined {
  const value = row[key];
  return typeof value === 'string' && value !== '' ? value : undefined;
}

export function readOptionalNumber(row: Row, key: string): number | undefined {
  const value = row[key];
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value !== '' && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

export const SCORES: Score[] = [1, 2, 3, 4, 5];

export function toScore(value: unknown): Score | undefined {
  return SCORES.find((score) => score === value);
}

export const BEER_COLUMNS = 'id, name, brewery, style, abv, created_by, created_at';
export const CAFE_COLUMNS = 'id, name, city, created_by, created_at';
export const GROUP_COLUMNS = 'id, name, photo_url, invite_code, created_by, created_at';
export const RATING_COLUMNS = 'id, user_id, beer_id, cafe_id, score, review, photo_url, created_at';

export function toBeer(row: Row): Beer {
  return {
    id: readString(row, 'id'),
    name: readString(row, 'name'),
    brewery: readOptionalString(row, 'brewery'),
    style: readOptionalString(row, 'style'),
    abv: readOptionalNumber(row, 'abv'),
    createdBy: readOptionalString(row, 'created_by'),
    createdAt: readString(row, 'created_at'),
  };
}

export function toCafe(row: Row): Cafe {
  return {
    id: readString(row, 'id'),
    name: readString(row, 'name'),
    city: readString(row, 'city'),
    createdBy: readOptionalString(row, 'created_by'),
    createdAt: readString(row, 'created_at'),
  };
}

export function toGroup(row: Row): Group {
  return {
    id: readString(row, 'id'),
    name: readString(row, 'name'),
    photoUrl: readOptionalString(row, 'photo_url'),
    inviteCode: readString(row, 'invite_code'),
    createdBy: readString(row, 'created_by'),
    createdAt: readString(row, 'created_at'),
  };
}

export function toRating(row: Row): Rating {
  return {
    id: readString(row, 'id'),
    userId: readString(row, 'user_id'),
    beerId: readString(row, 'beer_id'),
    cafeId: readOptionalString(row, 'cafe_id'),
    score: toScore(row.score) ?? 1,
    review: readOptionalString(row, 'review'),
    photoUrl: readOptionalString(row, 'photo_url'),
    createdAt: readString(row, 'created_at'),
  };
}

export function readNestedRow(row: Row, key: string): Row | undefined {
  const value = row[key];
  if (typeof value !== 'object' || !value || Array.isArray(value)) return undefined;
  return Object.fromEntries(Object.entries(value));
}

export function readNestedRows(row: Row, key: string): Row[] {
  const value = row[key];
  if (!Array.isArray(value)) return [];
  return value.flatMap((item: unknown) =>
    typeof item === 'object' && item ? [Object.fromEntries(Object.entries(item))] : [],
  );
}

export function cleanSearchTerm(term: string): string {
  return term.replace(/[,()"\\%_*]/g, ' ').trim();
}
