/** Rij uit de tabel `profiles`. Velden met `?` mogen leeg zijn in de database. */
export interface Profile {
  id: string;
  username: string;
  /** Pad in de bucket "photos", bv. "<userId>/avatar.jpg". */
  avatarUrl?: string;
  /** ISO-datum, bv. "2026-10-26T20:15:00Z". */
  createdAt: string;
}
