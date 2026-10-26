/** Rij uit de tabel `group_members`. */
export interface GroupMember {
  groupId: string;
  userId: string;
  joinedAt: string;
}

/** Een lid van een groep met zijn profielgegevens, voor de ledenlijst. */
export interface GroupMemberWithProfile {
  userId: string;
  username: string;
  /** Pad in de bucket "photos". */
  avatarUrl?: string;
  joinedAt: string;
}
