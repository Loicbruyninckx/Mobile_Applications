import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import type { WeekStats as WeekStatsData } from '../types/Home';
import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface WeekStatsProps {
  stats: WeekStatsData;
  onTopPress: () => void;
  testID?: string;
}

function Stat({ value, label, testID }: { value: number; label: string; testID?: string }) {
  return (
    <Stack flex={1}>
      <Text size="xxl" weight="bold" font="display" color={colors.onAccent} testID={testID}>{value}</Text>
      <Text size="sm" weight="medium" color={colors.onAccent}>{label}</Text>
    </Stack>
  );
}

/** Limegroen blok "Jouw week" met 3 cijfers over de laatste 7 dagen. */
export function WeekStats({ stats, onTopPress, testID }: WeekStatsProps) {
  return (
    <Card variant="accent" testID={testID}>
      <Stack padding="lg" gap="sm">
        <Row justify="space-between">
          <Text size="lg" weight="bold" font="display" color={colors.onAccent}>Jouw week</Text>
          <Pressable onPress={onTopPress} style={styles.link} accessibilityRole="link" testID="home-week-top">
            <Text weight="bold" color={colors.onAccent} underline>Mijn top ›</Text>
          </Pressable>
        </Row>
        <Row align="flex-end">
          <Stat value={stats.ratingCount} label={stats.ratingCount === 1 ? 'bier' : 'bieren'} testID="home-week-ratings" />
          <Stat value={stats.newStyleCount} label={stats.newStyleCount === 1 ? 'nieuwe stijl' : 'nieuwe stijlen'} testID="home-week-styles" />
          <Stat value={stats.cafeCount} label={stats.cafeCount === 1 ? 'café' : 'cafés'} testID="home-week-cafes" />
        </Row>
      </Stack>
    </Card>
  );
}

const styles = StyleSheet.create({
  link: { minHeight: 48, justifyContent: 'center' },
});
