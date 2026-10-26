import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { formatDate } from '../utils/formatDate';
import type { RatingWithDetails } from '../types/Rating';
import { Card } from './primitives/Card';
import { Icon } from './primitives/Icon';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { StarDisplay } from './StarDisplay';

interface RatingCardProps {
  rating: RatingWithDetails;
  /** Plaats in de lijst (1 = bovenaan). Laat weg om geen nummer te tonen. */
  rank?: number;
  testID?: string;
}

/** "Tripel · De Kroon, Leuven" — lege delen worden overgeslagen. */
function subtitle(rating: RatingWithDetails): string {
  const cafe = rating.cafe !== undefined ? `${rating.cafe.name}, ${rating.cafe.city}` : undefined;
  return [rating.beer.style, cafe].filter((part) => part !== undefined).join(' · ');
}


/** Kaart voor één rating, naar het voorbeeld van ItemCard. Puur weergave, geen logica. */
export function RatingCard({ rating, rank, testID }: RatingCardProps) {
  const details = subtitle(rating);

  return (
    <Card testID={testID}>
      <Stack gap="sm" padding="md">
        <Row gap="md">
          {rank !== undefined && (
            <Text size="lg" weight="bold" color={colors.textSecondary}>#{rank}</Text>
          )}
          <View style={styles.iconBox}>
            <Icon name="beer-outline" size={24} color={colors.primary} />
          </View>
          <Stack flex={1}>
            <Text
              size="lg"
              weight="bold"
              color={colors.primary}
              numberOfLines={1}
              testID={testID !== undefined ? `${testID}-beer-name` : undefined}
            >
              {rating.beer.name}
            </Text>
            {details !== '' && (
              <Text color={colors.textSecondary} numberOfLines={1}>{details}</Text>
            )}
          </Stack>
          <StarDisplay score={rating.score} testID={testID !== undefined ? `${testID}-stars` : undefined} />
        </Row>
        {rating.review !== undefined && (
          <Text numberOfLines={2} testID={testID !== undefined ? `${testID}-review` : undefined}>
            “{rating.review}”
          </Text>
        )}
        <Text size="sm" color={colors.textSecondary}>{formatDate(rating.createdAt)}</Text>
      </Stack>
    </Card>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
