import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Spinner } from './primitives/Spinner';
import { Text } from './primitives/Text';

type ButtonVariant = 'primary' | 'secondary' | 'dark';

interface StyledButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  isLoading?: boolean;
  testID?: string;
}

const TEXT_COLORS: Record<ButtonVariant, string> = {
  primary: colors.onAccent,
  secondary: colors.text,
  dark: colors.accent,
};

export function StyledButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  testID,
}: StyledButtonProps) {
  const textColor = TEXT_COLORS[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={[styles.base, styles[size], styles[variant], isLoading && styles.disabled]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {isLoading ? (
        <Spinner size="small" color={textColor} />
      ) : (
        <Text size="lg" weight="bold" font="display" color={textColor}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 22,
  },
  md: { minHeight: 52 },
  lg: { minHeight: 60 },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.text },
  dark: { backgroundColor: colors.onAccent },
  disabled: { opacity: 0.7 },
});
