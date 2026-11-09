import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import type { TopBeer } from '../types/Home';
import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { PhotoBox } from './PhotoBox';
import { StarDisplay } from './StarDisplay';

interface TopBeerCardProps {
  top: TopBeer;
  testID?: string;
}

export function TopBeerCard({ top, testID }: TopBeerCardProps) {
  const details = [top.beer.style, `${top.ratingCount}× geraten`].filter((part) => part !== undefined).join(' · ');

  return (
    <View style={styles.width}>
      <Card testID={testID}>
        <Stack padding="sm" gap="sm">
          <PhotoBox uri={top.imageUri}>
            <Stack flex={1} justify="space-between">
              <Text size="xl" weight="bold" color={colors.accent}>#{top.rank}</Text>
              <Row justify="flex-end">
                <StarDisplay score={top.averageScore} testID={testID !== undefined ? `${testID}-score` : undefined} />
              </Row>
            </Stack>
          </PhotoBox>
          <Stack padding="sm" gap="none">
            <Text weight="bold" font="display" numberOfLines={1} testID={testID !== undefined ? `${testID}-name` : undefined}>
              {top.beer.name}
            </Text>
            <Text size="sm" color={colors.textSecondary} numberOfLines={1}>{details}</Text>
          </Stack>
        </Stack>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  width: { width: 172 },
});
