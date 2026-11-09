import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

interface NavItemProps {
  label: string;
  onPress: () => void;
  active?: boolean;
  icon?: IconName;
  variant?: 'default' | 'fab';
  testID?: string;
}

export function NavItem({ label, onPress, active = false, icon, variant = 'default', testID }: NavItemProps) {
  const isFab = variant === 'fab';
  const iconColor = active ? colors.accent : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={styles.base}
      role="tab"
      aria-selected={active}
      accessibilityLabel={label}
      testID={testID}
    >
      {isFab ? (
        <View style={styles.fab}>
          {icon !== undefined && <Icon name={icon} size={34} color={colors.onAccent} />}
        </View>
      ) : (
        <>
          {icon !== undefined && <Icon name={icon} size={26} color={iconColor} />}
          <Text
            size="sm"
            weight="bold"
            color={active ? colors.text : colors.textSecondary}
            align="center"
            numberOfLines={1}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  fab: {
    width: 64,
    height: 64,
    marginTop: -28,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderWidth: 4,
    borderColor: colors.background,
  },
});
