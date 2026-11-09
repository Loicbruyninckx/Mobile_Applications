import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Icon } from './primitives/Icon';
import { Spinner } from './primitives/Spinner';
import { Text } from './primitives/Text';

interface MenuRowProps {
  label: string;
  onPress: () => void;
  danger?: boolean;
  isLoading?: boolean;
  testID?: string;
}

export function MenuRow({ label, onPress, danger = false, isLoading = false, testID }: MenuRowProps) {
  const color = danger ? colors.error : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={styles.base}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <Text size="lg" weight="medium" color={color}>{label}</Text>
      {isLoading ? <Spinner color={color} /> : <Icon name="chevron-forward" size={20} color={danger ? color : colors.textSecondary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
