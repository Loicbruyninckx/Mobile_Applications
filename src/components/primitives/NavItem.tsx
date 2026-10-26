import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

interface NavItemProps {
  label: string;
  onPress: () => void;
  active?: boolean;
  icon?: IconName;
  testID?: string;
}

export function NavItem({ label, onPress, active = false, icon, testID }: NavItemProps) {
  const color = active ? colors.primary : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={styles.base}
      // role en aria-* i.p.v. accessibilityRole/accessibilityState: react-native-web zet
      // alleen deze om naar de DOM, en op native werken ze ook.
      role="tab"
      aria-selected={active}
      accessibilityLabel={label}
      testID={testID}
    >
      {icon !== undefined && <Icon name={icon} size={24} color={color} />}
      <Text size="sm" weight={active ? 'bold' : 'normal'} color={color} align="center" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // flex: 1 → alle tabs even breed; minHeight 56 → ruim boven de 48dp tikzone.
  base: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
});
