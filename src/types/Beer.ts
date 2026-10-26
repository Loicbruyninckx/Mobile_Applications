/** Rij uit de tabel `beers` (gedeelde catalogus). */
export interface Beer {
  id: string;
  name: string;
  brewery?: string;
  style?: string;
  /** Alcoholpercentage, bv. 9.5. */
  abv?: number;
  /** Leeg als het account van de maker verwijderd is. */
  createdBy?: string;
  createdAt: string;
}

/** Wat de app meestuurt om een bier toe te voegen. */
export interface NewBeer {
  name: string;
  brewery?: string;
  style?: string;
  abv?: number;
}
