import type { ComponentProps } from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/state/useAuthStore';
import { Nav } from '../../src/components/primitives/Nav';
import { NavItem } from '../../src/components/primitives/NavItem';
import { Screen } from '../../src/components/primitives/Screen';
import { Spinner } from '../../src/components/primitives/Spinner';
import type { IconName } from '../../src/components/primitives/Icon';
import { colors } from '../../src/theme/colors';

/** De props die expo-router aan een eigen tabbalk geeft. */
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

interface TabConfig {
  /** Bestandsnaam van het scherm in app/(app)/. */
  name: string;
  label: string;
  icon: IconName;
  activeIcon: IconName;
  /** fab = de grote ronde knop in het midden. */
  variant?: 'default' | 'fab';
}

/**
 * Volgorde en inhoud van de tabbalk. Andere routes (bv. details/[id]) krijgen geen tab.
 * Bier raten staat in het midden als grote knop: de belangrijkste actie, bereikbaar met je duim.
 */
const TABS: TabConfig[] = [
  { name: 'index', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'mijn-ratings', label: 'Ratings', icon: 'star-outline', activeIcon: 'star' },
  { name: 'toevoegen', label: 'Bier raten', icon: 'add', activeIcon: 'add', variant: 'fab' },
  { name: 'groepen', label: 'Groepen', icon: 'people-outline', activeIcon: 'people' },
  { name: 'profiel', label: 'Profiel', icon: 'person-outline', activeIcon: 'person' },
];

function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;

  return (
    <Nav bottomInset={insets.bottom} testID="tab-bar">
      {TABS.map((tab) => {
        const active = tab.name === activeName;
        return (
          <NavItem
            key={tab.name}
            label={tab.label}
            icon={active ? tab.activeIcon : tab.icon}
            active={active}
            variant={tab.variant}
            onPress={() => navigation.navigate(tab.name)}
            testID={`tab-${tab.name}`}
          />
        );
      })}
    </Nav>
  );
}

export default function AppLayout() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Nog aan het kijken of er een bewaarde sessie is: niet te vroeg naar /login sturen.
  if (!isInitialized) {
    return (
      <Screen padding="lg">
        <Spinner color={colors.accent} />
      </Screen>
    );
  }

  // Ingelogd zijn is verplicht voor alles in app/(app)/.
  if (!isAuthenticated) return <Redirect href="/login" />;

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
      ))}
    </Tabs>
  );
}
