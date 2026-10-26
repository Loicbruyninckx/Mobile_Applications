import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/state/useAuthStore';
import { Screen } from '../../src/components/primitives/Screen';
import { Spinner } from '../../src/components/primitives/Spinner';

export default function AppLayout() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Nog aan het kijken of er een bewaarde sessie is: niet te vroeg naar /login sturen.
  if (!isInitialized) {
    return (
      <Screen padding="lg">
        <Spinner />
      </Screen>
    );
  }

  if (!isAuthenticated) return <Redirect href="/login" />;

  return <Stack />;
}
