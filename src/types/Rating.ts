import type { Beer, NewBeer } from './Beer';
import type { Cafe, NewCafe } from './Cafe';

/** Score van 1 tot 5 sterren (zelfde regel als de check constraint in SQL). */
export type Score = 1 | 2 | 3 | 4 | 5;

/** Rij uit de tabel `ratings`. */
export interface Rating {
  id: string;
  userId: string;
  beerId: string;
  cafeId?: string;
  score: Score;
  /** Maximaal 500 tekens. */
  review?: string;
  /** Pad in de bucket "photos", bv. "<userId>/rating-123.jpg". */
  photoUrl?: string;
  createdAt: string;
}

/** Een bestaand bier uit de catalogus, of een nieuw dat bij het opslaan wordt aangemaakt. */
export type BeerChoice = { kind: 'existing'; beer: Beer } | { kind: 'new'; beer: NewBeer };

/** Een bestaand café, of een nieuw dat bij het opslaan wordt aangemaakt. */
export type CafeChoice = { kind: 'existing'; cafe: Cafe } | { kind: 'new'; cafe: NewCafe };

/** Alles wat het Toevoegen-scherm doorgeeft aan ratingService.addRating(). */
export interface NewRatingInput {
  beer: BeerChoice;
  cafe?: CafeChoice;
  score: Score;
  review?: string;
  /** Groepen waarmee de rating gedeeld wordt (mag leeg zijn). */
  groupIds: string[];
}

/** Wat de app meestuurt om een rating te maken. userId vult de database zelf in. */
export interface NewRating {
  beerId: string;
  cafeId?: string;
  score: Score;
  review?: string;
  photoUrl?: string;
}

/** Een rating samen met het bier en (als ingevuld) het café, voor lijsten zoals Mijn ratings. */
export interface RatingWithDetails extends Rating {
  beer: Beer;
  cafe?: Cafe;
}

/** Een rating in de groepsfeed: met de naam van wie ze gaf en de groepen waarmee ze gedeeld is. */
export interface FeedRating extends RatingWithDetails {
  authorName: string;
  /** Alleen groepen waar jij ook lid van bent. */
  groupIds: string[];
}
