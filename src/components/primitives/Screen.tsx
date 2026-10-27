import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { colors } from '../../theme/colors';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { Spinner } from './Spinner';

interface ScreenProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  scrollable?: boolean;
  /** Geef dit mee om pull-to-refresh aan te zetten (alleen als scrollable). */
  onRefresh?: () => void;
  /** true = er wordt herladen, de spinner blijft staan. */
  refreshing?: boolean;
  testID?: string;
}

export function Screen({
  children,
  padding = 'md',
  scrollable = true,
  onRefresh,
  refreshing = false,
  testID,
}: ScreenProps) {
  const pull = usePullToRefresh(onRefresh);

  if (!scrollable) {
    return (
      <View style={[styles.container, styles[padding]]} testID={testID}>
        {children}
      </View>
    );
  }

  // Web: eigen indicator bovenaan (RefreshControl werkt niet in de browser).
  const webIndicatorHeight = refreshing ? 48 : pull.pullDistance;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, styles[padding]]}
      testID={testID}
      refreshControl={
        onRefresh !== undefined && !pull.enabled ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} />
        ) : undefined
      }
      {...(pull.enabled ? pull.handlers : {})}
    >
      {pull.enabled && webIndicatorHeight > 0 && (
        <View style={[styles.indicator, { height: webIndicatorHeight }]}>
          <Spinner color={colors.accent} />
        </View>
      )}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1 },
  indicator: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  none: {},
  sm: { padding: 8 },
  md: { padding: 16 },
  lg: { padding: 20 },
});
