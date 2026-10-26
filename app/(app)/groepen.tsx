import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { EmptyState } from '../../src/components/primitives/EmptyState';

export default function GroepenScreen() {
  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Text size="xl" weight="bold">Groepen</Text>
        <EmptyState
          title="Nog geen groepen"
          description="Maak een groep of join er een met een uitnodigingscode."
        />
      </Stack>
    </Screen>
  );
}
