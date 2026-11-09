import type { Beer, NewBeer } from './Beer';
import type { Cafe, NewCafe } from './Cafe';

export type Score = 1 | 2 | 3 | 4 | 5;

export interface Rating {
  id: string;
  userId: string;
  beerId: string;
  cafeId?: string;
  score: Score;
  review?: string;
  photoUrl?: string;
  createdAt: string;
}

export type BeerChoice = { kind: 'existing'; beer: Beer } | { kind: 'new'; beer: NewBeer };

export type CafeChoice = { kind: 'existing'; cafe: Cafe } | { kind: 'new'; cafe: NewCafe };

export interface NewRatingInput {
  beer: BeerChoice;
  cafe?: CafeChoice;
  score: Score;
  review?: string;
  groupIds: string[];
}

export interface NewRating {
  beerId: string;
  cafeId?: string;
  score: Score;
  review?: string;
  photoUrl?: string;
}

export interface RatingWithDetails extends Rating {
  beer: Beer;
  cafe?: Cafe;
}

export interface FeedRating extends RatingWithDetails {
  authorName: string;
  groupIds: string[];
}
