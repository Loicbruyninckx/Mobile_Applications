import { View, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Text } from './Text';

interface TagProps {
  label: string;
  onRemove?: () => void;
}

/** Kleine grijze pil met tekst, bv. "12 bieren". */
export function Tag({ label, onRemove }: TagProps) {
  return (
    <View style={styles.base}>
      <Text weight="bold" color={colors.textSecondary}>{label}</Text>
      {onRemove !== undefined && (
        <Pressable onPress={onRemove} style={styles.removeButton} accessibilityLabel={`${label} verwijderen`}>
          <Text weight="bold" color={colors.textSecondary}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  removeButton: { paddingHorizontal: 4 },
});
