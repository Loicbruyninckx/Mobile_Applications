import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Score } from '../types/Rating';
import { Text } from './primitives/Text';

const SCORES: Score[] = [1, 2, 3, 4, 5];

/** Korte uitleg bij elke score, bv. "4/5 · Heel goed" boven de knoppen. */
export const SCORE_LABELS: Record<Score, string> = {
  1: 'Niet lekker',
  2: 'Matig',
  3: 'Oké',
  4: 'Heel goed',
  5: 'Top!',
};

interface StarRatingProps {
  /** Gekozen score, of undefined als er nog niets gekozen is. */
  value?: Score;
  onChange: (score: Score) => void;
  testID?: string;
}

/**
 * Vijf grote cijferknoppen: tik op 4 → score 4. Knoppen 1 t/m 4 kleuren dan limegroen
 * en de gekozen knop krijgt een witte rand (verschil zit dus niet alleen in de kleur).
 * Voor schermlezers is het een keuzegroep (radiogroup): je kiest precies één score,
 * en de gekozen knop is "aangevinkt" (aria-checked).
 * De gevulde knoppen krijgen een testID `<testID>-<score>-filled` voor de E2E-tests.
 */
export function StarRating({ value, onChange, testID }: StarRatingProps) {
  return (
    <View style={styles.row} role="radiogroup" aria-label="Score">
      {SCORES.map((score) => {
        const filled = value !== undefined && score <= value;
        const chosen = score === value;
        return (
          <Pressable
            key={score}
            onPress={() => onChange(score)}
            style={[styles.button, filled ? styles.filled : styles.empty, chosen && styles.chosen]}
            role="radio"
            aria-checked={chosen}
            aria-label={score === 1 ? '1 ster' : `${score} sterren`}
            testID={testID !== undefined ? `${testID}-${score}` : undefined}
          >
            <View testID={filled && testID !== undefined ? `${testID}-${score}-filled` : undefined}>
              <Text size="lg" weight="bold" font="display" color={filled ? colors.onAccent : colors.textSecondary}>
                {score}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  button: {
    flex: 1,
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: { backgroundColor: colors.accent, borderColor: colors.accent },
  empty: { backgroundColor: colors.surface, borderColor: colors.border },
  chosen: { borderWidth: 3, borderColor: colors.text },
});
