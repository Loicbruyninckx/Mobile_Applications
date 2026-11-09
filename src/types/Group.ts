export interface Group {
  id: string;
  name: string;
  photoUrl?: string;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
}

export interface NewGroup {
  name: string;
  photoUrl?: string;
}

export interface GroupWithMemberCount extends Group {
  memberCount: number;
}

export interface JoinGroupResult {
  groupId: string;
  groupName: string;
  alreadyMember: boolean;
}
