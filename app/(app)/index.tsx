import { useAuthStore } from '../../src/state/useAuthStore';
import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { EmptyState } from '../../src/components/primitives/EmptyState';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Text size="xl" weight="bold">Home</Text>
        <Text>{user !== undefined ? `Welkom, ${user.username}` : 'Welkom'}</Text>
        <EmptyState
          title="Nog geen ratings in je groepen"
          description="Hier verschijnen de laatste ratings van je vrienden."
        />
      </Stack>
    </Screen>
  );
}
