import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Spinner } from './primitives/Spinner';
import { Text } from './primitives/Text';

interface StyledButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  testID?: string;
}

export function StyledButton({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  testID,
}: StyledButtonProps) {
  const textColor = variant === 'primary' ? colors.card : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={[styles.base, styles[variant], isLoading && styles.disabled]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {isLoading ? (
        <Spinner size="small" color={textColor} />
      ) : (
        <Text size="lg" weight="bold" color={textColor}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // minHeight 52: ruim boven de 48dp tikzone uit de stijlgids.
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  disabled: { opacity: 0.7 },
});
