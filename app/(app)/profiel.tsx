import { useAuthStore } from '../../src/state/useAuthStore';
import { Avatar } from '../../src/components/primitives/Avatar';
import { Card } from '../../src/components/primitives/Card';
import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { MenuRow } from '../../src/components/MenuRow';
import { colors } from '../../src/theme/colors';

export default function ProfielScreen() {
  const { user, logout, isLoading } = useAuthStore();

  return (
    <Screen padding="lg">
      <Stack gap="lg">
        {user !== undefined && (
          <Stack gap="md" align="center">
            <Avatar name={user.username} size="xl" ring />
            <Stack align="center">
              <Text size="xl" weight="bold" align="center">{user.username}</Text>
              <Text size="lg" color={colors.textSecondary} align="center">{user.email}</Text>
            </Stack>
          </Stack>
        )}
        <Card>
          <MenuRow label="Uitloggen" onPress={logout} isLoading={isLoading} danger testID="logout-button" />
        </Card>
      </Stack>
    </Screen>
  );
}
