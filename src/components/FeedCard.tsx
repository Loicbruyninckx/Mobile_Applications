import { colors } from '../theme/colors';
import type { FeedRating } from '../types/Rating';
import { formatTimeAgo } from '../utils/formatDate';
import { Avatar } from './primitives/Avatar';
import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { StarDisplay } from './StarDisplay';

interface FeedCardProps {
  rating: FeedRating;
  /** Bv. "Tripelaars" of "Tripelaars, Kot 12". Laat weg om geen groep te tonen. */
  groupLabel?: string;
  /** Toont "Jij" in plaats van je eigen naam. */
  isMine?: boolean;
  testID?: string;
}

/** "@ De Kroon, Leuven · Tripelaars" — lege delen worden overgeslagen. */
function details(rating: FeedRating, groupLabel?: string): string {
  const cafe = rating.cafe !== undefined ? `@ ${rating.cafe.name}, ${rating.cafe.city}` : undefined;
  return [rating.beer.style, cafe, groupLabel].filter((part) => part !== undefined && part !== '').join(' · ');
}

/** Eén rating in de groepsfeed: wie, wanneer, score, bier, café, groep en review. */
export function FeedCard({ rating, groupLabel, isMine = false, testID }: FeedCardProps) {
  const beerDetails = details(rating, groupLabel);

  return (
    <Card testID={testID}>
      <Stack padding="lg">
        <Row gap="md" align="flex-start">
          <Avatar name={rating.authorName} size="md" />
          <Stack flex={1} gap="none">
            <Text color={colors.textSecondary} numberOfLines={1}>
              <Text weight="bold">{isMine ? 'Jij' : rating.authorName}</Text>
              {` · ${formatTimeAgo(rating.createdAt)}`}
            </Text>
            <Text size="lg" weight="bold" font="display" testID={testID !== undefined ? `${testID}-beer-name` : undefined}>
              {rating.beer.name}
            </Text>
            {beerDetails !== '' && <Text color={colors.textSecondary}>{beerDetails}</Text>}
            {rating.review !== undefined && (
              <Text testID={testID !== undefined ? `${testID}-review` : undefined}>“{rating.review}”</Text>
            )}
          </Stack>
          <StarDisplay score={rating.score} testID={testID !== undefined ? `${testID}-stars` : undefined} />
        </Row>
      </Stack>
    </Card>
  );
}
