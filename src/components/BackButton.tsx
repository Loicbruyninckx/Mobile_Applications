import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Icon } from './primitives/Icon';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
  testID?: string;
}

/** Ronde terugknop (48 × 48) linksboven op een detailscherm. */
export function BackButton({ onPress, label = 'Terug', testID }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.base}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <Icon name="chevron-back" size={24} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
