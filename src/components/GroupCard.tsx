import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Card } from './primitives/Card';
import { Icon } from './primitives/Icon';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface GroupCardProps {
  name: string;
  memberCount: number;
  onPress: () => void;
  testID?: string;
}

export function GroupCard({ name, memberCount, onPress, testID }: GroupCardProps) {
  return (
    <Card onPress={onPress} testID={testID}>
      <View style={styles.inner}>
        <Row gap="md">
          <View style={styles.thumb}>
            <Icon name="people-outline" size={30} color={colors.textMuted} />
          </View>
          <Stack flex={1} gap="sm">
            <Text size="lg" weight="bold" font="display" numberOfLines={2}>{name}</Text>
            <Row gap="sm">
              <Icon name="person-outline" size={16} color={colors.textSecondary} />
              <Text color={colors.textSecondary}>{memberCount === 1 ? '1 lid' : `${memberCount} leden`}</Text>
            </Row>
          </Stack>
          <Icon name="chevron-forward" size={22} color={colors.textSecondary} />
        </Row>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  inner: { padding: 12, paddingRight: 18 },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
