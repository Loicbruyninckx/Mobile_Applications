import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { formatDate } from '../utils/formatDate';
import type { RatingWithDetails } from '../types/Rating';
import { Card } from './primitives/Card';
import { Divider } from './primitives/Divider';
import { Icon } from './primitives/Icon';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { StarDisplay } from './StarDisplay';

interface RatingCardProps {
  rating: RatingWithDetails;
  rank?: number;
  variant?: 'hero' | 'row';
  showDate?: boolean;
  testID?: string;
}

function subtitle(rating: RatingWithDetails, showDate: boolean): string {
  const cafe = rating.cafe !== undefined ? `${rating.cafe.name}, ${rating.cafe.city}` : undefined;
  const date = showDate ? formatDate(rating.createdAt) : undefined;
  return [rating.beer.style, cafe, date].filter((part) => part !== undefined).join(' · ');
}

export function RatingCard({ rating, rank, variant = 'row', showDate = false, testID }: RatingCardProps) {
  const details = subtitle(rating, showDate);
  const childID = (suffix: string) => (testID !== undefined ? `${testID}-${suffix}` : undefined);

  const beerName = (
    <Text size={variant === 'hero' ? 'xl' : 'lg'} weight="bold" font="display" numberOfLines={variant === 'hero' ? 2 : 1} testID={childID('beer-name')}>
      {rating.beer.name}
    </Text>
  );
  const detailsText = details !== '' && <Text color={colors.textSecondary} numberOfLines={1}>{details}</Text>;
  const review = rating.review !== undefined && (
    <Text color={colors.textSecondary} numberOfLines={2} testID={childID('review')}>
      “{rating.review}”
    </Text>
  );

  if (variant === 'hero') {
    return (
      <Card variant="raised" testID={testID}>
        <Stack padding="lg" gap="lg">
          <Row justify="space-between" align="flex-start">
            <Text size="xxl" weight="bold" color={colors.accent}>#{rank ?? 1}</Text>
            <StarDisplay score={rating.score} testID={childID('stars')} />
          </Row>
          <Stack>
            {beerName}
            {detailsText}
            {review}
          </Stack>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack testID={testID}>
      <View style={styles.row}>
        <Row gap="md">
          {rank !== undefined && (
            <View style={styles.rank}>
              <Text size="xl" weight="bold" color={colors.textMuted}>{rank}</Text>
            </View>
          )}
          <View style={styles.thumb}>
            <Icon name="beer-outline" size={24} color={colors.textSecondary} />
          </View>
          <Stack flex={1}>
            {beerName}
            {detailsText}
            {review}
          </Stack>
          <StarDisplay score={rating.score} variant="plain" testID={childID('stars')} />
        </Row>
      </View>
      <Divider />
    </Stack>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 16 },
  rank: { width: 32 },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
