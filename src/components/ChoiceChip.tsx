import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Icon } from './primitives/Icon';
import { Text } from './primitives/Text';

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /**
   * light = gekozen chip wordt wit met een vinkje (aan/uit, bv. "Deel met"),
   * accent = gekozen chip wordt limegroen (één keuze uit een rij, bv. een filter).
   */
  variant?: 'light' | 'accent';
  testID?: string;
}

/** Ronde aan/uit-knop, bv. om te kiezen met welke groepen je deelt. */
export function ChoiceChip({ label, selected, onPress, variant = 'light', testID }: ChoiceChipProps) {
  const color = selected ? colors.onAccent : colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected ? styles[variant] : styles.unselected]}
      role="checkbox"
      aria-checked={selected}
      accessibilityLabel={label}
      testID={testID}
    >
      {selected && variant === 'light' && <Icon name="checkmark" size={18} color={color} />}
      <Text size="lg" weight="bold" font="display" color={color}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
  },
  light: { backgroundColor: colors.text, borderColor: colors.text },
  accent: { backgroundColor: colors.accent, borderColor: colors.accent },
  unselected: { backgroundColor: 'transparent', borderColor: colors.border },
});
