import { colors } from '../theme/colors';
import { formatDate } from '../utils/formatDate';
import type { GroupMemberWithProfile } from '../types/GroupMember';
import { Avatar } from './primitives/Avatar';
import { Badge } from './primitives/Badge';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface MemberRowProps {
  member: GroupMemberWithProfile;
  isCreator: boolean;
  isMe: boolean;
}


/** Eén lid in de ledenlijst: avatar met initialen, naam en sinds wanneer lid. */
export function MemberRow({ member, isCreator, isMe }: MemberRowProps) {
  return (
    <Row gap="md">
      <Avatar name={member.username} size="md" />
      <Stack flex={1}>
        <Text size="lg" weight="bold" color={colors.primary} numberOfLines={1}>
          {isMe ? `${member.username} (jij)` : member.username}
        </Text>
        <Text size="sm" color={colors.textSecondary}>Lid sinds {formatDate(member.joinedAt)}</Text>
      </Stack>
      {isCreator && <Badge label="Maker" />}
    </Row>
  );
}
