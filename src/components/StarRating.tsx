import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import type { Score } from '../types/Rating';
import { Icon } from './primitives/Icon';
import { Row } from './primitives/Row';

const SCORES: Score[] = [1, 2, 3, 4, 5];

interface StarRatingProps {
  /** Gekozen score, of undefined als er nog niets gekozen is. */
  value?: Score;
  onChange: (score: Score) => void;
  testID?: string;
}

/** Vijf grote sterknoppen: tik op ster 4 → score 4. */
export function StarRating({ value, onChange, testID }: StarRatingProps) {
  return (
    <Row gap="sm" wrap>
      {SCORES.map((score) => {
        const filled = value !== undefined && score <= value;
        return (
          <Pressable
            key={score}
            onPress={() => onChange(score)}
            style={[styles.star, filled ? styles.filled : styles.empty]}
            accessibilityRole="button"
            accessibilityLabel={score === 1 ? '1 ster' : `${score} sterren`}
            accessibilityState={{ selected: score === value }}
            testID={testID !== undefined ? `${testID}-${score}` : undefined}
          >
            {/* Altijd donkere ster op amber (contrast), grijze ster op wit. */}
            <Icon name="star" size={24} color={filled ? colors.primary : colors.inputBorder} />
          </Pressable>
        );
      })}
    </Row>
  );
}

const styles = StyleSheet.create({
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
