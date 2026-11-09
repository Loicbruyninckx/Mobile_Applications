import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Icon, type IconName } from './primitives/Icon';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
  icon?: IconName;
  testID?: string;
}

export function BackButton({ onPress, label = 'Terug', icon = 'chevron-back', testID }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.base}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <Icon name={icon} size={24} color={colors.text} />
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
    backgroundColor: colors.surface,
  },
});
