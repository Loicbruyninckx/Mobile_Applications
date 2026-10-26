/** Rij uit de tabel `groups`. */
export interface Group {
  id: string;
  name: string;
  /** Pad in de bucket "photos". */
  photoUrl?: string;
  /** 6 tekens, automatisch gegenereerd door de database. */
  inviteCode: string;
  createdBy: string;
  createdAt: string;
}

/** Wat de app meestuurt om een groep te maken. Code en maker vult de database zelf in. */
export interface NewGroup {
  name: string;
  photoUrl?: string;
}

/** Een groep met het aantal leden, voor de lijst "Mijn groepen". */
export interface GroupWithMemberCount extends Group {
  memberCount: number;
}
