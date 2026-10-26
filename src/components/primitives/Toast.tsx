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
      <Text weight="medium" color={colors.card}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  default: { backgroundColor: colors.text },
  success: { backgroundColor: colors.success },
  error: { backgroundColor: colors.error },
});
