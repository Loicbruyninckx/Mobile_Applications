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
  /** Donkere rand: dit item is gekozen. */
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
              <Icon name={icon} size={22} color={colors.primary} />
            </View>
          )}
          <Stack flex={1}>
            <Text size="lg" weight="bold" color={colors.primary} numberOfLines={1}>
              {title}
            </Text>
            {subtitle !== undefined && (
              <Text color={colors.textSecondary} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </Stack>
          {actionLabel !== undefined && (
            <Text weight="bold" color={colors.primary}>
              {actionLabel}
            </Text>
          )}
        </Row>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  inner: { minHeight: 56, paddingHorizontal: 14, paddingVertical: 10, justifyContent: 'center' },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
