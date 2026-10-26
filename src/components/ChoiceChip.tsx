import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Icon } from './primitives/Icon';
import { Text } from './primitives/Text';

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}

/** Ronde aan/uit-knop, bv. om te kiezen met welke groepen je deelt. */
export function ChoiceChip({ label, selected, onPress, testID }: ChoiceChipProps) {
  const color = selected ? colors.card : colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected ? styles.selected : styles.unselected]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      testID={testID}
    >
      {selected && <Icon name="checkmark" size={18} color={color} />}
      <Text size="lg" color={color}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  unselected: { backgroundColor: colors.card, borderColor: colors.inputBorder },
});
