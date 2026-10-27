import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Text } from './Text';

interface ToastProps {
  message: string;
  variant?: 'default' | 'success' | 'error';
  visible: boolean;
  testID?: string;
}

export function Toast({ message, variant = 'default', visible, testID }: ToastProps) {
  // Lege fragment i.p.v. null (schoolregel: geen null).
  if (!visible) return <></>;

  return (
    <View style={[styles.base, styles[variant]]} accessibilityRole="alert" testID={testID}>
      {/* Alle varianten hebben een lichte achtergrond: altijd donkere tekst. */}
      <Text weight="bold" color={colors.onAccent}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  default: { backgroundColor: colors.text },
  success: { backgroundColor: colors.success },
  error: { backgroundColor: colors.error },
});
