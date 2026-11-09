import type { Beer } from './Beer';
import type { Cafe } from './Cafe';
import type { GroupWithMemberCount } from './Group';
import type { FeedRating } from './Rating';

export interface ActiveFriend {
  userId: string;
  username: string;
  avatarUri?: string;
  cafeName?: string;
  ratedAt: string;
}

export interface WeekStats {
  ratingCount: number;
  newStyleCount: number;
  cafeCount: number;
}

export interface TopBeer {
  rank: number;
  beer: Beer;
  averageScore: number;
  ratingCount: number;
  imageUri?: string;
}

export interface Hotspot {
  cafe: Cafe;
  averageScore: number;
  ratingCount: number;
  groupId: string;
  groupName: string;
  groupRatingCount: number;
}

export interface HomeFeedRating extends FeedRating {
  imageUri?: string;
}

export interface HomeData {
  groups: GroupWithMemberCount[];
  activeFriends: ActiveFriend[];
  week: WeekStats;
  topBeers: TopBeer[];
  hotspot?: Hotspot;
  feed: HomeFeedRating[];
}
