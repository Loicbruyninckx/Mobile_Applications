import { useState } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme/colors';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

interface InputFieldProps {
  label: string;
  showLabel?: boolean;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  testID?: string;
  variant?: 'default' | 'pill' | 'code';
  icon?: IconName;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function InputField({
  label,
  showLabel = true,
  required = false,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  testID,
  variant = 'default',
  icon,
  multiline = false,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const showEye = secureTextEntry && value !== '';

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text weight="medium" color={colors.textSecondary}>
          {label}
          {required && <Text weight="bold" color={colors.accent}> *</Text>}
        </Text>
      )}
      <View style={[styles.box, styles[variant], multiline && styles.multilineBox, error !== undefined && styles.boxError, isFocused && (variant === 'code' ? styles.codeFocused : styles.boxFocused)]}>
        {icon !== undefined && <Icon name={icon} size={22} color={colors.textSecondary} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={variant === 'code' ? colors.textMuted : colors.textSecondary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          style={[styles.input, variant === 'code' && styles.codeInput, multiline && styles.multiline]}
          testID={testID}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          accessibilityLabel={required ? `${label} (verplicht)` : label}
        />
        {showEye && (
          <Pressable
            onPress={() => setIsPasswordVisible((visible) => !visible)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
            testID={testID !== undefined ? `${testID}-toggle-visibility` : undefined}
          >
            <Icon name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {error !== undefined && <Text size="sm" color={colors.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  default: { borderRadius: 999 },
  pill: { borderRadius: 999 },
  code: { borderRadius: 18, backgroundColor: colors.background, borderColor: colors.background },
  multilineBox: { alignItems: 'flex-start', borderRadius: 24, paddingVertical: 14 },
  boxError: { borderColor: colors.error },
  boxFocused: { borderColor: colors.accent },
  codeFocused: { borderColor: colors.text },
  input: {
    flex: 1,
    minHeight: 48,
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.text,
  },
  eyeButton: { width: 48, height: 48, marginRight: -12, alignItems: 'center', justifyContent: 'center' },
  codeInput: { fontFamily: fonts.display, fontSize: 22, letterSpacing: 6 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
});
