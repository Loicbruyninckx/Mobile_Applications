import { supabase } from './supabaseClient';
import { getMyGroups } from './groupService';
import { getGroupFeed } from './ratingService';
import {
  BEER_COLUMNS,
  CAFE_COLUMNS,
  RATING_COLUMNS,
  readNestedRow,
  readNestedRows,
  readOptionalString,
  readString,
  type Row,
  toBeer,
  toCafe,
  toRating,
} from './rowParsers';
import type { Beer } from '../types/Beer';
import type { Cafe } from '../types/Cafe';
import type { GroupWithMemberCount } from '../types/Group';
import type { ActiveFriend, HomeData, Hotspot, TopBeer, WeekStats } from '../types/Home';
import type { FeedRating } from '../types/Rating';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const ACTIVE_WINDOW = 3 * HOUR;
const WEEK_WINDOW = 7 * DAY;
const MIN_RATINGS = 2;
const TOP_BEER_COUNT = 5;
const SIGNED_URL_SECONDS = 60 * 60;

interface WeekRating extends FeedRating {
  authorAvatarPath?: string;
}

interface MyRatingSummary {
  style?: string;
  cafeId?: string;
  createdAt: string;
}

async function getCurrentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (userId === undefined) {
    throw new Error('Je bent niet ingelogd.');
  }
  return userId;
}

async function getSharedRatingsSince(groupIds: string[], since: Date): Promise<WeekRating[]> {
  if (groupIds.length === 0) return [];

  const { data, error } = await supabase
    .from('ratings')
    .select(
      `${RATING_COLUMNS}, beer:beers(${BEER_COLUMNS}), cafe:cafes(${CAFE_COLUMNS}), author:profiles(username, avatar_url), rating_shares!inner(group_id)`,
    )
    .in('rating_shares.group_id', groupIds)
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error('Het weekoverzicht kon niet geladen worden. Controleer je internetverbinding.');
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
        authorAvatarPath: authorRow !== undefined ? readOptionalString(authorRow, 'avatar_url') : undefined,
        groupIds: readNestedRows(row, 'rating_shares').map((share) => readString(share, 'group_id')),
      },
    ];
  });
}

async function getMyRatingSummaries(userId: string): Promise<MyRatingSummary[]> {
  const { data, error } = await supabase
    .from('ratings')
    .select('cafe_id, created_at, beer:beers(style)')
    .eq('user_id', userId);
  if (error) {
    throw new Error('Je weekoverzicht kon niet geladen worden. Controleer je internetverbinding.');
  }

  return data.map((row: Row) => {
    const beerRow = readNestedRow(row, 'beer');
    return {
      style: beerRow !== undefined ? readOptionalString(beerRow, 'style') : undefined,
      cafeId: readOptionalString(row, 'cafe_id'),
      createdAt: readString(row, 'created_at'),
    };
  });
}

type ToUri = (path: string | undefined) => string | undefined;

async function getSignedUrls(paths: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(paths)];
  if (unique.length === 0) return new Map();

  const { data, error } = await supabase.storage.from('photos').createSignedUrls(unique, SIGNED_URL_SECONDS);
  if (error) return new Map();

  const urls = new Map<string, string>();
  for (const item of data) {
    if (typeof item.path === 'string' && typeof item.signedUrl === 'string' && !item.error) {
      urls.set(item.path, item.signedUrl);
    }
  }
  return urls;
}

function isAfter(iso: string, since: Date): boolean {
  return new Date(iso).getTime() >= since.getTime();
}

function average(ratings: FeedRating[]): number {
  return ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;
}

function groupBy<T>(items: T[], keyOf: (item: T) => string | undefined): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    if (key === undefined) continue;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return groups;
}

function compareRanking(
  a: { averageScore: number; ratingCount: number; name: string },
  b: { averageScore: number; ratingCount: number; name: string },
): number {
  return b.averageScore - a.averageScore || b.ratingCount - a.ratingCount || a.name.localeCompare(b.name);
}

function findActiveFriends(ratings: WeekRating[], myUserId: string, now: Date, toUri: ToUri): ActiveFriend[] {
  const since = new Date(now.getTime() - ACTIVE_WINDOW);
  const latestPerUser = new Map<string, WeekRating>();
  for (const rating of ratings) {
    if (rating.userId === myUserId || !isAfter(rating.createdAt, since)) continue;
    if (!latestPerUser.has(rating.userId)) latestPerUser.set(rating.userId, rating);
  }

  return [...latestPerUser.values()].map((rating) => ({
    userId: rating.userId,
    username: rating.authorName,
    avatarUri: toUri(rating.authorAvatarPath),
    cafeName: rating.cafe?.name,
    ratedAt: rating.createdAt,
  }));
}

function computeWeekStats(myRatings: MyRatingSummary[], weekStart: Date): WeekStats {
  const thisWeek = myRatings.filter((rating) => isAfter(rating.createdAt, weekStart));
  const before = myRatings.filter((rating) => !isAfter(rating.createdAt, weekStart));

  const normalize = (style: string | undefined) => style?.trim().toLowerCase() || undefined;
  const oldStyles = new Set(before.map((rating) => normalize(rating.style)));
  const newStyles = new Set(
    thisWeek.map((rating) => normalize(rating.style)).filter((style) => style !== undefined && !oldStyles.has(style)),
  );

  return {
    ratingCount: thisWeek.length,
    newStyleCount: newStyles.size,
    cafeCount: new Set(thisWeek.flatMap((rating) => (rating.cafeId !== undefined ? [rating.cafeId] : []))).size,
  };
}

function computeTopBeers(ratings: WeekRating[], toUri: ToUri): TopBeer[] {
  const perBeer = groupBy(ratings, (rating) => rating.beerId);

  const ranked = [...perBeer.values()]
    .filter((beerRatings) => beerRatings.length >= MIN_RATINGS)
    .map((beerRatings) => {
      const beer: Beer = beerRatings[0].beer;
      return {
        beer,
        name: beer.name,
        averageScore: average(beerRatings),
        ratingCount: beerRatings.length,
        photoPath: beerRatings.find((rating) => rating.photoUrl !== undefined)?.photoUrl,
      };
    })
    .sort(compareRanking)
    .slice(0, TOP_BEER_COUNT);

  return ranked.map((item, index) => ({
    rank: index + 1,
    beer: item.beer,
    averageScore: item.averageScore,
    ratingCount: item.ratingCount,
    imageUri: toUri(item.photoPath),
  }));
}

function computeHotspot(ratings: WeekRating[], groups: GroupWithMemberCount[]): Hotspot | undefined {
  const perCafe = groupBy(ratings, (rating) => rating.cafeId);

  const best = [...perCafe.values()]
    .filter((cafeRatings) => cafeRatings.length >= MIN_RATINGS)
    .flatMap((cafeRatings) => {
      const cafe: Cafe | undefined = cafeRatings[0].cafe;
      if (cafe === undefined) return [];
      return [{ cafe, name: cafe.name, averageScore: average(cafeRatings), ratingCount: cafeRatings.length, cafeRatings }];
    })
    .sort(compareRanking)[0];
  if (best === undefined) return undefined;

  const groupCounts = groups
    .map((group) => ({
      group,
      count: best.cafeRatings.filter((rating) => rating.groupIds.includes(group.id)).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.group.name.localeCompare(b.group.name));
  const topGroup = groupCounts[0];
  if (topGroup === undefined) return undefined;

  return {
    cafe: best.cafe,
    averageScore: best.averageScore,
    ratingCount: best.ratingCount,
    groupId: topGroup.group.id,
    groupName: topGroup.group.name,
    groupRatingCount: topGroup.count,
  };
}

export async function getHomeData(now: Date = new Date()): Promise<HomeData> {
  const userId = await getCurrentUserId();
  const weekStart = new Date(now.getTime() - WEEK_WINDOW);

  const groups = await getMyGroups();
  const groupIds = groups.map((group) => group.id);

  const [weekRatings, myRatings, feed] = await Promise.all([
    getSharedRatingsSince(groupIds, weekStart),
    getMyRatingSummaries(userId),
    getGroupFeed(groupIds),
  ]);

  const paths = [
    ...weekRatings.flatMap((rating) => [rating.photoUrl, rating.authorAvatarPath]),
    ...feed.map((rating) => rating.photoUrl),
  ];
  const signed = await getSignedUrls(paths.flatMap((path) => (path !== undefined ? [path] : [])));
  const toUri: ToUri = (path) => (path !== undefined ? signed.get(path) : undefined);

  return {
    groups,
    activeFriends: findActiveFriends(weekRatings, userId, now, toUri),
    week: computeWeekStats(myRatings, weekStart),
    topBeers: computeTopBeers(weekRatings, toUri),
    hotspot: computeHotspot(weekRatings, groups),
    feed: feed.map((rating) => ({ ...rating, imageUri: toUri(rating.photoUrl) })),
  };
}
