import type { Beer } from './Beer';
import type { Cafe } from './Cafe';
import type { GroupWithMemberCount } from './Group';
import type { FeedRating } from './Rating';

/** Een groepslid dat de laatste 3 uur een rating maakte ("Nu actief"). */
export interface ActiveFriend {
  userId: string;
  username: string;
  /** Signed URL van de profielfoto, als die er is. */
  avatarUri?: string;
  /** Café van de laatste rating; leeg als die zonder café was. */
  cafeName?: string;
  ratedAt: string;
}

/** De 3 cijfers in "Jouw week" (laatste 7 dagen, alleen je eigen ratings). */
export interface WeekStats {
  ratingCount: number;
  /** Stijlen die je deze week raatte en daarvoor nog nooit. */
  newStyleCount: number;
  cafeCount: number;
}

/** Eén kaart in "Toppers deze week". */
export interface TopBeer {
  /** 1 = beste. */
  rank: number;
  beer: Beer;
  averageScore: number;
  ratingCount: number;
  /** Signed URL van de recentste foto van dit bier, als die er is. */
  imageUri?: string;
}

/** Het café met het hoogste gemiddelde deze week ("Hotspot van de week"). */
export interface Hotspot {
  cafe: Cafe;
  averageScore: number;
  /** Aantal ratings in dat café, in al je groepen samen. */
  ratingCount: number;
  /** De groep met de meeste ratings in dat café: daar gaat een tik naartoe. */
  groupId: string;
  groupName: string;
  /** Aantal ratings in dat café binnen die groep. */
  groupRatingCount: number;
}

/** Een rating in de feed op Home, met een bruikbare foto-URL. */
export interface HomeFeedRating extends FeedRating {
  /** Signed URL van de foto; leeg = compacte rij zonder foto. */
  imageUri?: string;
}

/** Alles wat het Home-scherm nodig heeft, in één keer geladen. */
export interface HomeData {
  groups: GroupWithMemberCount[];
  activeFriends: ActiveFriend[];
  week: WeekStats;
  topBeers: TopBeer[];
  /** Leeg als geen enkel café deze week minstens 2 ratings kreeg. */
  hotspot?: Hotspot;
  feed: HomeFeedRating[];
}
