import { useCallback, useMemo, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { getMyRatings } from '../../src/services/ratingService';
import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { Row } from '../../src/components/primitives/Row';
import { Tag } from '../../src/components/primitives/Tag';
import { EmptyState } from '../../src/components/primitives/EmptyState';
import { InputField } from '../../src/components/primitives/InputField';
import { StyledButton } from '../../src/components/StyledButton';
import { RatingCard } from '../../src/components/RatingCard';
import { CardSkeleton } from '../../src/components/CardSkeleton';
import { SegmentedControl, type SegmentOption } from '../../src/components/SegmentedControl';
import type { RatingWithDetails } from '../../src/types/Rating';

type SortOrder = 'score' | 'recent';

const SORT_OPTIONS: SegmentOption<SortOrder>[] = [
  { value: 'score', label: 'Hoogste score' },
  { value: 'recent', label: 'Recentst' },
];

const SKELETON_COUNT = 4;

function byScore(a: RatingWithDetails, b: RatingWithDetails): number {
  return b.score - a.score || b.createdAt.localeCompare(a.createdAt);
}

function byDate(a: RatingWithDetails, b: RatingWithDetails): number {
  return b.createdAt.localeCompare(a.createdAt);
}

function matches(rating: RatingWithDetails, term: string): boolean {
  const haystack = [
    rating.beer.name,
    rating.beer.brewery,
    rating.beer.style,
    rating.cafe?.name,
    rating.cafe?.city,
    rating.review,
  ]
    .filter((part) => part !== undefined)
    .join(' ')
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
}

export default function MijnRatingsScreen() {
  const [ratings, setRatings] = useState<RatingWithDetails[] | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<SortOrder>('score');
  const [query, setQuery] = useState('');

  const load = useCallback(() => {
    setError(undefined);
    getMyRatings()
      .then(setRatings)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Laden mislukt.'));
  }, []);

  useFocusEffect(load);

  const visibleRatings = useMemo(() => {
    if (ratings === undefined) return [];
    const term = query.trim();
    const filtered = term === '' ? ratings : ratings.filter((rating) => matches(rating, term));
    return [...filtered].sort(sortOrder === 'score' ? byScore : byDate);
  }, [ratings, query, sortOrder]);

  const renderContent = () => {
    if (error !== undefined && ratings === undefined) {
      return (
        <EmptyState
          title="Er ging iets mis"
          description={error}
          action={<StyledButton label="Opnieuw proberen" onPress={load} testID="ratings-retry" />}
        />
      );
    }

    if (ratings === undefined) {
      return (
        <Stack gap="md">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </Stack>
      );
    }

    if (ratings.length === 0) {
      return (
        <EmptyState
          title="Nog geen ratings"
          description="Rate je eerste bier, dan verschijnt het hier. Zo vergeet je nooit meer wat je lekker vond."
          action={
            <StyledButton label="Rate je eerste bier" onPress={() => router.navigate('/toevoegen')} testID="ratings-empty-add" />
          }
        />
      );
    }

    if (visibleRatings.length === 0) {
      return <EmptyState title="Geen resultaten" description={`Niets gevonden voor “${query.trim()}”.`} />;
    }

    const byScoreOrder = sortOrder === 'score';
    return (
      <Stack>
        {visibleRatings.map((rating, index) => (
          <RatingCard
            key={rating.id}
            rating={rating}
            rank={byScoreOrder ? index + 1 : undefined}
            variant={byScoreOrder && index === 0 ? 'hero' : 'row'}
            showDate={!byScoreOrder}
            testID="rating-card"
          />
        ))}
      </Stack>
    );
  };

  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Row justify="space-between" gap="md">
          <Text size="xl" weight="bold">Mijn top</Text>
          {ratings !== undefined && ratings.length > 0 && (
            <Tag label={ratings.length === 1 ? '1 bier' : `${ratings.length} bieren`} />
          )}
        </Row>
        {ratings !== undefined && ratings.length > 0 && (
          <Stack gap="md">
            <SegmentedControl options={SORT_OPTIONS} value={sortOrder} onChange={setSortOrder} testID="ratings-sort" />
            <InputField
              label="Zoeken"
              showLabel={false}
              variant="pill"
              icon="search"
              value={query}
              onChangeText={setQuery}
              placeholder="Zoek in je ratings…"
              testID="ratings-search"
            />
          </Stack>
        )}
        {renderContent()}
      </Stack>
    </Screen>
  );
}
