import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Score } from '../types/Rating';
import { Icon } from './primitives/Icon';

const SCORES: Score[] = [1, 2, 3, 4, 5];

interface StarRatingProps {
  /** Gekozen score, of undefined als er nog niets gekozen is. */
  value?: Score;
  onChange: (score: Score) => void;
  testID?: string;
}

/**
 * Vijf grote sterknoppen: tik op ster 4 → score 4.
 * Voor schermlezers is het een keuzegroep (radiogroup): je kiest precies één score,
 * en de gekozen ster is "aangevinkt" (aria-checked).
 * De gevulde sterren krijgen een testID `<testID>-<score>-filled` voor de E2E-tests.
 */
export function StarRating({ value, onChange, testID }: StarRatingProps) {
  return (
    <View style={styles.row} role="radiogroup" aria-label="Score">
      {SCORES.map((score) => {
        const filled = value !== undefined && score <= value;
        return (
          <Pressable
            key={score}
            onPress={() => onChange(score)}
            style={[styles.star, filled ? styles.filled : styles.empty]}
            role="radio"
            aria-checked={score === value}
            aria-label={score === 1 ? '1 ster' : `${score} sterren`}
            testID={testID !== undefined ? `${testID}-${score}` : undefined}
          >
            <View testID={filled && testID !== undefined ? `${testID}-${score}-filled` : undefined}>
              {/* Altijd donkere ster op amber (contrast), grijze ster op wit. */}
              <Icon name="star" size={24} color={filled ? colors.primary : colors.inputBorder} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  star: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: { backgroundColor: colors.accent },
  empty: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
});
