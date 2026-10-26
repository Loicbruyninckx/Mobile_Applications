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

/** Wat de app meestuurt om een rating te maken. userId vult de database zelf in. */
export interface NewRating {
  beerId: string;
  cafeId?: string;
  score: Score;
  review?: string;
  photoUrl?: string;
}
