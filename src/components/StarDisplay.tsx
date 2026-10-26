import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import type { Score } from '../types/Rating';
import { Icon } from './primitives/Icon';

const STARS: Score[] = [1, 2, 3, 4, 5];

interface StarDisplayProps {
  score: Score;
  size?: number;
}

/** Toont een score als 5 sterren (alleen lezen). Gevuld vs. leeg verschilt ook in vorm, niet alleen kleur. */
export function StarDisplay({ score, size = 16 }: StarDisplayProps) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${score} van 5 sterren`}
    >
      {STARS.map((star) => (
        <Icon key={star} name={star <= score ? 'star' : 'star-outline'} size={size} color={colors.accent} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
});
