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

/** "Tripel · @ De Kroon, Leuven" — lege delen worden overgeslagen. */
function details(rating: FeedRating): string {
  const cafe = rating.cafe !== undefined ? `@ ${rating.cafe.name}, ${rating.cafe.city}` : undefined;
  return [rating.beer.style, cafe].filter((part) => part !== undefined).join(' · ');
}

/** Eén rating in de groepsfeed: wie, wanneer, in welke groep, score, bier, café en review. */
export function FeedCard({ rating, groupLabel, isMine = false, testID }: FeedCardProps) {
  const meta = [formatTimeAgo(rating.createdAt), groupLabel].filter((part) => part !== undefined && part !== '').join(' · ');
  const beerDetails = details(rating);

  return (
    <Card testID={testID}>
      <Stack gap="md" padding="md">
        <Row gap="md">
          <Avatar name={rating.authorName} size="md" />
          <Stack flex={1}>
            <Text size="lg" weight="bold" numberOfLines={1}>
              {isMine ? 'Jij' : rating.authorName}
            </Text>
            <Text size="sm" color={colors.textSecondary} numberOfLines={1}>{meta}</Text>
          </Stack>
          <StarDisplay score={rating.score} />
        </Row>
        <Stack gap="sm">
          <Text size="lg" weight="bold" color={colors.primary}>{rating.beer.name}</Text>
          {beerDetails !== '' && <Text color={colors.textSecondary}>{beerDetails}</Text>}
          {rating.review !== undefined && <Text>“{rating.review}”</Text>}
        </Stack>
      </Stack>
    </Card>
  );
}
