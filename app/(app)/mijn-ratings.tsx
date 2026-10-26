import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { EmptyState } from '../../src/components/primitives/EmptyState';

export default function MijnRatingsScreen() {
  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Text size="xl" weight="bold">Mijn ratings</Text>
        <EmptyState
          title="Nog geen ratings"
          description="Bieren die je raat, verschijnen hier gesorteerd op score."
        />
      </Stack>
    </Screen>
  );
}
