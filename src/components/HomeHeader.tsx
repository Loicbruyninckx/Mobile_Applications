import { Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { Avatar } from './primitives/Avatar';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface HomeHeaderProps {
  /** Bv. "Dinsdagavond". */
  dayPart: string;
  username?: string;
  avatarUri?: string;
  onAvatarPress: () => void;
}

/** Bovenaan Home: dagdeel, "Hey [naam]" en je avatar (tik = naar Profiel). */
export function HomeHeader({ dayPart, username, avatarUri, onAvatarPress }: HomeHeaderProps) {
  return (
    <Row justify="space-between" gap="md">
      <Stack flex={1}>
        <Text color={colors.textSecondary}>{dayPart}</Text>
        <Text size="xl" weight="bold" numberOfLines={1} testID="home-greeting">
          Hey {username ?? 'daar'}
        </Text>
      </Stack>
      <Pressable onPress={onAvatarPress} accessibilityRole="link" accessibilityLabel="Naar je profiel" testID="home-avatar">
        <Avatar name={username} uri={avatarUri} size="lg" ring />
      </Pressable>
    </Row>
  );
}
