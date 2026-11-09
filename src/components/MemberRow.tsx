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
  testID?: string;
}

export function MemberRow({ member, isCreator, isMe, testID }: MemberRowProps) {
  return (
    <Row gap="md">
      <Avatar name={member.username} size="md" ring={isMe} />
      <Stack flex={1}>
        <Text size="lg" weight="bold" font="display" numberOfLines={1} testID={testID}>
          {isMe ? `${member.username} (jij)` : member.username}
        </Text>
        <Text color={colors.textSecondary}>Lid sinds {formatDate(member.joinedAt)}</Text>
      </Stack>
      {isCreator && <Badge label="Maker" />}
    </Row>
  );
}
