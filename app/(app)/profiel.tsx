import { useAuthStore } from '../../src/state/useAuthStore';
import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { StyledButton } from '../../src/components/StyledButton';
import { colors } from '../../src/theme/colors';

export default function ProfielScreen() {
  const { user, logout, isLoading } = useAuthStore();

  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Text size="xl" weight="bold">Profiel</Text>
        {user !== undefined && (
          <Stack gap="sm">
            <Text size="lg" weight="bold">{user.username}</Text>
            <Text color={colors.textSecondary}>{user.email}</Text>
          </Stack>
        )}
        <StyledButton
          label="Uitloggen"
          onPress={logout}
          isLoading={isLoading}
          variant="secondary"
          testID="logout-button"
        />
      </Stack>
    </Screen>
  );
}
