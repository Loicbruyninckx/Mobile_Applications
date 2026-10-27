import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const TEXT_COLORS = {
  default: colors.onAccent,
  success: colors.onAccent,
  warning: colors.onAccent,
  error: colors.text,
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Text size="sm" weight="bold" color={TEXT_COLORS[variant]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  default: { backgroundColor: colors.accent },
  success: { backgroundColor: colors.success },
  warning: { backgroundColor: '#FFC94D' },
  error: { backgroundColor: colors.error },
});
