import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import {
  BEER_COLUMNS,
  CAFE_COLUMNS,
  RATING_COLUMNS,
  cleanSearchTerm,
  readNestedRow,
  readNestedRows,
  readString,
  type Row,
  toBeer,
  toCafe,
  toRating,
} from './rowParsers';
import type { Beer, NewBeer } from '../types/Beer';
import type { Cafe, NewCafe } from '../types/Cafe';
import type { FeedRating, NewRatingInput, Rating, RatingWithDetails } from '../types/Rating';

const SEARCH_LIMIT = 8;
/** Postgres-foutcode voor "bestaat al" (unique index). */
const UNIQUE_VIOLATION = '23505';

/** De rating is wél opgeslagen, maar het delen met groepen lukte niet. Niet opnieuw opslaan! */
export class RatingShareError extends Error {
  constructor() {
    super('Je rating is opgeslagen, maar delen met je groepen is mislukt.');
    this.name = 'RatingShareError';
  }
}

function saveError(error: PostgrestError, what: string): Error {
  if (error.code === '23514') {
    return new Error(`${what}: een van de velden is ongeldig.`);
  }
  return new Error(`${what} mislukt. Controleer je internetverbinding en probeer opnieuw.`);
}

/** Zoekt bieren op naam of brouwerij (hoofdletters maken niet uit). */
export async function searchBeers(term: string): Promise<Beer[]> {
  const clean = cleanSearchTerm(term);
  if (clean.length < 2) return [];

  const { data, error } = await supabase
    .from('beers')
    .select(BEER_COLUMNS)
    .or(`name.ilike.%${clean}%,brewery.ilike.%${clean}%`)
    .order('name')
    .limit(SEARCH_LIMIT);
  if (error) {
    throw new Error('Zoeken mislukt. Controleer je internetverbinding.');
  }
  return data.map(toBeer);
}

/** Zoekt cafés op naam of stad. */
export async function searchCafes(term: string): Promise<Cafe[]> {
  const clean = cleanSearchTerm(term);
  if (clean.length < 2) return [];

  const { data, error } = await supabase
    .from('cafes')
    .select(CAFE_COLUMNS)
    .or(`name.ilike.%${clean}%,city.ilike.%${clean}%`)
    .order('name')
    .limit(SEARCH_LIMIT);
  if (error) {
    throw new Error('Zoeken mislukt. Controleer je internetverbinding.');
  }
  return data.map(toCafe);
}

/**
 * Voegt een bier toe aan de gedeelde catalogus.
 * Bestaat het al (zelfde naam + brouwerij), dan krijg je het bestaande bier terug.
 */
export async function createBeer(beer: NewBeer): Promise<Beer> {
  const name = beer.name.trim();
  const brewery = beer.brewery?.trim() || undefined;

  const { data, error } = await supabase
    .from('beers')
    .insert({ name, brewery, style: beer.style?.trim() || undefined, abv: beer.abv })
    .select(BEER_COLUMNS)
    .single();

  if (!error) return toBeer(data);

  if (error.code === UNIQUE_VIOLATION) {
    const existing = await supabase.from('beers').select(BEER_COLUMNS).ilike('name', cleanSearchTerm(name));
    const match = (existing.data ?? [])
      .map(toBeer)
      .find((b) => (b.brewery ?? '').toLowerCase() === (brewery ?? '').toLowerCase());
    if (match !== undefined) return match;
  }
  throw saveError(error, 'Bier toevoegen');
}

/** Voegt een café toe. Bestaat het al (zelfde naam + stad), dan krijg je het bestaande terug. */
export async function createCafe(cafe: NewCafe): Promise<Cafe> {
  const name = cafe.name.trim();
  const city = cafe.city.trim();

  const { data, error } = await supabase
    .from('cafes')
    .insert({ name, city })
    .select(CAFE_COLUMNS)
    .single();

  if (!error) return toCafe(data);

  if (error.code === UNIQUE_VIOLATION) {
    const existing = await supabase.from('cafes').select(CAFE_COLUMNS).ilike('name', cleanSearchTerm(name));
    const match = (existing.data ?? [])
      .map(toCafe)
      .find((c) => c.city.toLowerCase() === city.toLowerCase());
    if (match !== undefined) return match;
  }
  throw saveError(error, 'Café toevoegen');
}

/**
 * Al je eigen ratings, met bier en café erbij (nieuwste eerst).
 * We filteren expliciet op jouw user_id: RLS laat ook ratings van groepsleden door.
 */
export async function getMyRatings(): Promise<RatingWithDetails[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (userId === undefined) {
    throw new Error('Je bent niet ingelogd.');
  }

  const { data, error } = await supabase
    .from('ratings')
    .select(`${RATING_COLUMNS}, beer:beers(${BEER_COLUMNS}), cafe:cafes(${CAFE_COLUMNS})`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error('Je ratings konden niet geladen worden. Controleer je internetverbinding.');
  }

  return data.flatMap((row: Row) => {
    const beerRow = readNestedRow(row, 'beer');
    // Elke rating heeft een bier (not null in SQL); zonder bier slaan we de rij over.
    if (beerRow === undefined) return [];
    const cafeRow = readNestedRow(row, 'cafe');
    return [{ ...toRating(row), beer: toBeer(beerRow), cafe: cafeRow !== undefined ? toCafe(cafeRow) : undefined }];
  });
}

const FEED_LIMIT = 50;

/**
 * De groepsfeed: de recentste ratings die gedeeld zijn met minstens één van `groupIds`,
 * met bier, café en de naam van wie ze gaf. Je eigen gedeelde ratings staan er ook in.
 * `rating_shares!inner` = alleen ratings die echt gedeeld zijn met een van die groepen.
 */
export async function getGroupFeed(groupIds: string[]): Promise<FeedRating[]> {
  if (groupIds.length === 0) return [];

  const { data, error } = await supabase
    .from('ratings')
    .select(
      `${RATING_COLUMNS}, beer:beers(${BEER_COLUMNS}), cafe:cafes(${CAFE_COLUMNS}), author:profiles(username), rating_shares!inner(group_id)`,
    )
    .in('rating_shares.group_id', groupIds)
    .order('created_at', { ascending: false })
    .limit(FEED_LIMIT);
  if (error) {
    throw new Error('De feed kon niet geladen worden. Controleer je internetverbinding.');
  }

  return data.flatMap((row: Row) => {
    const beerRow = readNestedRow(row, 'beer');
    if (beerRow === undefined) return [];
    const cafeRow = readNestedRow(row, 'cafe');
    const authorRow = readNestedRow(row, 'author');
    return [
      {
        ...toRating(row),
        beer: toBeer(beerRow),
        cafe: cafeRow !== undefined ? toCafe(cafeRow) : undefined,
        authorName: authorRow !== undefined ? readString(authorRow, 'username') : 'Onbekend',
        groupIds: readNestedRows(row, 'rating_shares').map((share) => readString(share, 'group_id')),
      },
    ];
  });
}

/**
 * Slaat een rating op in één keer:
 * 1. nieuw bier en/of café aanmaken als dat nodig is,
 * 2. de rating zelf opslaan (user_id vult de database in),
 * 3. de rating delen met de gekozen groepen.
 */
export async function addRating(input: NewRatingInput): Promise<Rating> {
  const beer = input.beer.kind === 'existing' ? input.beer.beer : await createBeer(input.beer.beer);

  let cafeId: string | undefined;
  if (input.cafe !== undefined) {
    cafeId = input.cafe.kind === 'existing' ? input.cafe.cafe.id : (await createCafe(input.cafe.cafe)).id;
  }

  const review = input.review?.trim() || undefined;
  const { data, error } = await supabase
    .from('ratings')
    .insert({ beer_id: beer.id, cafe_id: cafeId, score: input.score, review })
    .select(RATING_COLUMNS)
    .single();
  if (error) {
    throw saveError(error, 'Rating opslaan');
  }
  const rating = toRating(data);

  if (input.groupIds.length > 0) {
    const shares = input.groupIds.map((groupId) => ({ rating_id: rating.id, group_id: groupId }));
    const { error: shareError } = await supabase.from('rating_shares').insert(shares);
    if (shareError) {
      throw new RatingShareError();
    }
  }

  return rating;
}
