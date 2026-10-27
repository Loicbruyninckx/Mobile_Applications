import { colors } from '../theme/colors';
import type { FeedRating } from '../types/Rating';
import { formatTimeAgo } from '../utils/formatDate';
import { Avatar } from './primitives/Avatar';
import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { PhotoBox } from './PhotoBox';
import { StarDisplay } from './StarDisplay';

interface FeedCardProps {
  rating: FeedRating;
  /** URL van de foto. Met foto = grote kaart, zonder = compacte rij. */
  imageUri?: string;
  /** Bv. "Tripelaars" of "Tripelaars, Kot 12". Laat weg om geen groep te tonen. */
  groupLabel?: string;
  /** Toont "Jij" in plaats van je eigen naam. */
  isMine?: boolean;
  testID?: string;
}

/** "Tripel · @ De Kroon, Leuven · Tripelaars" — lege delen worden overgeslagen. */
function details(rating: FeedRating, groupLabel?: string): string {
  const cafe = rating.cafe !== undefined ? `@ ${rating.cafe.name}, ${rating.cafe.city}` : undefined;
  return [rating.beer.style, cafe, groupLabel].filter((part) => part !== undefined && part !== '').join(' · ');
}

/** Eén rating in de groepsfeed: wie, wanneer, score, bier, café, groep en review. */
export function FeedCard({ rating, imageUri, groupLabel, isMine = false, testID }: FeedCardProps) {
  const beerDetails = details(rating, groupLabel);
  const id = (suffix: string) => (testID !== undefined ? `${testID}-${suffix}` : undefined);

  const author = (
    <Text color={colors.textSecondary} numberOfLines={1}>
      <Text weight="bold">{isMine ? 'Jij' : rating.authorName}</Text>
      {` · ${formatTimeAgo(rating.createdAt)}`}
    </Text>
  );
  const text = (
    <>
      <Text size="lg" weight="bold" font="display" testID={id('beer-name')}>
        {rating.beer.name}
      </Text>
      {beerDetails !== '' && <Text color={colors.textSecondary}>{beerDetails}</Text>}
      {rating.review !== undefined && <Text testID={id('review')}>“{rating.review}”</Text>}
    </>
  );

  // Met foto: grote kaart met de foto bovenaan en de score erop.
  if (imageUri !== undefined) {
    return (
      <Card testID={testID}>
        <Stack padding="sm" gap="sm">
          <PhotoBox uri={imageUri} aspectRatio={4 / 3}>
            <Row justify="flex-end">
              <StarDisplay score={rating.score} testID={id('stars')} />
            </Row>
          </PhotoBox>
          <Row gap="md" align="flex-start">
            <Avatar name={rating.authorName} size="md" />
            <Stack flex={1} gap="none">
              {author}
              {text}
            </Stack>
          </Row>
        </Stack>
      </Card>
    );
  }

  // Zonder foto: compacte rij.
  return (
    <Card testID={testID}>
      <Stack padding="md">
        <Row gap="md" align="flex-start">
          <Avatar name={rating.authorName} size="md" />
          <Stack flex={1} gap="none">
            {author}
            {text}
          </Stack>
          <StarDisplay score={rating.score} testID={id('stars')} />
        </Row>
      </Stack>
    </Card>
  );
}
