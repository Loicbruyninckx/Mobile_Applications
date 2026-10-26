import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Text } from './primitives/Text';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  testID?: string;
}

/** Rij van aaneengesloten knoppen waarvan er altijd één actief is, bv. om te sorteren. */
export function SegmentedControl<T extends string>({ options, value, onChange, testID }: SegmentedControlProps<T>) {
  return (
    <View style={styles.base} role="tablist" testID={testID}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && styles.active]}
            role="tab"
            aria-selected={active}
            testID={testID !== undefined ? `${testID}-${option.value}` : undefined}
          >
            <Text size="lg" weight={active ? 'bold' : 'normal'} color={active ? colors.card : colors.text}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  segment: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  active: { backgroundColor: colors.primary },
});
