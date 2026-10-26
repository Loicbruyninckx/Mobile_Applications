import { TextInput, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Text } from './Text';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  testID?: string;
  /** Meerdere regels, bv. voor een review. */
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  testID,
  multiline = false,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text weight="medium">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        style={[styles.input, multiline && styles.multiline, error !== undefined && styles.inputError]}
        testID={testID}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        accessibilityLabel={label}
      />
      {error !== undefined && <Text size="sm" color={colors.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  // fontSize 16: kleiner laat iOS Safari inzoomen bij het tikken.
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  inputError: { borderColor: colors.error },
});
