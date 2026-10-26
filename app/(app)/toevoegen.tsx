import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { EmptyState } from '../../src/components/primitives/EmptyState';

export default function ToevoegenScreen() {
  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Text size="xl" weight="bold">Bier raten</Text>
        <EmptyState
          title="Binnenkort"
          description="Hier zoek of voeg je een bier toe en geef je het een score."
        />
      </Stack>
    </Screen>
  );
}
