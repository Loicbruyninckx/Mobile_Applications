export interface GroupMember {
  groupId: string;
  userId: string;
  joinedAt: string;
}

export interface GroupMemberWithProfile {
  userId: string;
  username: string;
  avatarUrl?: string;
  joinedAt: string;
}
