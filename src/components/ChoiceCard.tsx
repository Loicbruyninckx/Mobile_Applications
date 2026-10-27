import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Card } from './primitives/Card';
import { Icon, type IconName } from './primitives/Icon';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface ChoiceCardProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Tekst rechts, bv. "Wijzig". */
  actionLabel?: string;
  /** Icoon helemaal rechts, bv. 'chevron-forward' voor een kaart die naar een detail gaat. */
  trailingIcon?: IconName;
  /** Limegroene rand: dit item is gekozen. */
  selected?: boolean;
  onPress: () => void;
  testID?: string;
}

/** Tikbare kaart voor een zoekresultaat of een gekozen bier/café. */
export function ChoiceCard({
  title,
  subtitle,
  icon,
  actionLabel,
  trailingIcon,
  selected = false,
  onPress,
  testID,
}: ChoiceCardProps) {
  return (
    <Card onPress={onPress} highlighted={selected} testID={testID}>
      <View style={styles.inner}>
        <Row gap="md">
          {icon !== undefined && (
            <View style={styles.iconBox}>
              <Icon name={icon} size={24} color={colors.textSecondary} />
            </View>
          )}
          <Stack flex={1}>
            <Text size="lg" weight="bold" font="display" numberOfLines={1}>
              {title}
            </Text>
            {subtitle !== undefined && (
              <Text color={colors.textSecondary} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </Stack>
          {actionLabel !== undefined && (
            <Text weight="bold" color={colors.accent} underline>
              {actionLabel}
            </Text>
          )}
          {trailingIcon !== undefined && <Icon name={trailingIcon} size={20} color={colors.textSecondary} />}
        </Row>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  inner: { minHeight: 64, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center' },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
