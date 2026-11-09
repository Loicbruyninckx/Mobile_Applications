import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Text } from './primitives/Text';

interface TextLinkProps {
  prefix?: string;
  label: string;
  onPress: () => void;
  testID?: string;
}

export function TextLink({ prefix, label, onPress, testID }: TextLinkProps) {
  return (
    <Pressable onPress={onPress} style={styles.base} accessibilityRole="link" accessibilityLabel={label} testID={testID}>
      <Text size="lg" align="center" color={colors.textSecondary}>
        {prefix !== undefined && `${prefix} `}
        <Text size="lg" weight="bold" color={colors.accent} underline>{label}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
