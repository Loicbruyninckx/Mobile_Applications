import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

interface NavItemProps {
  label: string;
  onPress: () => void;
  active?: boolean;
  icon?: IconName;
  /** fab = grote ronde limegroene knop in het midden, zonder zichtbaar label. */
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
      // role en aria-* i.p.v. accessibilityRole/accessibilityState: react-native-web zet
      // alleen deze om naar de DOM, en op native werken ze ook.
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
  // flex: 1 → alle tabs even breed; minHeight 56 → ruim boven de 48dp tikzone.
  base: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  // Steekt half boven de balk uit, zodat de belangrijkste actie (bier raten) opvalt en met je duim bereikbaar is.
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
