/** Rij uit de tabel `cafes` (gedeelde catalogus). */
export interface Cafe {
  id: string;
  name: string;
  city: string;
  /** Leeg als het account van de maker verwijderd is. */
  createdBy?: string;
  createdAt: string;
}

/** Wat de app meestuurt om een café toe te voegen. */
export interface NewCafe {
  name: string;
  city: string;
}
