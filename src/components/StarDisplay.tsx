import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Icon } from './primitives/Icon';
import { Text } from './primitives/Text';

interface StarDisplayProps {
  /** Een score van 1 tot 5. Mag een kommagetal zijn, bv. een gemiddelde van 4,5. */
  score: number;
  /**
   * pill = donkere ster en cijfer op een limegroene pil (op een kaart),
   * plain = limegroene ster en cijfer zonder achtergrond (in een lijst).
   */
  variant?: 'pill' | 'plain';
  size?: 'md' | 'lg';
  testID?: string;
}

/** "4,5" i.p.v. "4.5"; hele getallen zonder komma. */
function formatScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1).replace('.', ',');
}

/** Toont een score als "★ 4" (alleen lezen). Schermlezers horen "4 van 5 sterren". */
export function StarDisplay({ score, variant = 'pill', size = 'md', testID }: StarDisplayProps) {
  const color = variant === 'pill' ? colors.onAccent : colors.accent;
  const text = formatScore(score);

  return (
    <View
      style={[styles.base, variant === 'pill' && styles.pill, variant === 'pill' && size === 'lg' && styles.pillLarge]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${text} van 5 sterren`}
      testID={testID}
    >
      <Icon name="star" size={size === 'lg' ? 22 : 18} color={color} />
      <Text size={size === 'lg' ? 'xl' : 'lg'} weight="bold" font="display" color={color}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4 },
  pill: { backgroundColor: colors.accent, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  pillLarge: { paddingHorizontal: 18, paddingVertical: 10 },
});
