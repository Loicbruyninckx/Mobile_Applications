import { useCallback, useMemo, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { getMyRatings } from '../../src/services/ratingService';
import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { EmptyState } from '../../src/components/primitives/EmptyState';
import { InputField } from '../../src/components/primitives/InputField';
import { StyledButton } from '../../src/components/StyledButton';
import { RatingCard, RatingCardSkeleton } from '../../src/components/RatingCard';
import { SegmentedControl, type SegmentOption } from '../../src/components/SegmentedControl';
import { colors } from '../../src/theme/colors';
import type { RatingWithDetails } from '../../src/types/Rating';

type SortOrder = 'score' | 'recent';

const SORT_OPTIONS: SegmentOption<SortOrder>[] = [
  { value: 'score', label: 'Hoogste score' },
  { value: 'recent', label: 'Recentst' },
];

const SKELETON_COUNT = 4;

/** Hoogste score eerst; bij gelijke score de recentste eerst. */
function byScore(a: RatingWithDetails, b: RatingWithDetails): number {
  return b.score - a.score || b.createdAt.localeCompare(a.createdAt);
}

function byDate(a: RatingWithDetails, b: RatingWithDetails): number {
  return b.createdAt.localeCompare(a.createdAt);
}

/** Zoekt in biernaam, brouwerij, stijl, café en review (hoofdletters maken niet uit). */
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
  // undefined = nog nooit geladen → skeletons tonen.
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

  // Herladen telkens je naar deze tab gaat, zodat een net toegevoegde rating meteen verschijnt.
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
            <RatingCardSkeleton key={index} />
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

    return (
      <Stack gap="md">
        {visibleRatings.map((rating, index) => (
          <RatingCard
            key={rating.id}
            rating={rating}
            rank={sortOrder === 'score' ? index + 1 : undefined}
            testID="rating-card"
          />
        ))}
      </Stack>
    );
  };

  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Text size="xl" weight="bold" color={colors.primary}>Mijn ratings</Text>
        {ratings !== undefined && ratings.length > 0 && (
          <Stack gap="md">
            <InputField
              label="Zoeken"
              value={query}
              onChangeText={setQuery}
              placeholder="Zoek in je ratings…"
              testID="ratings-search"
            />
            <SegmentedControl options={SORT_OPTIONS} value={sortOrder} onChange={setSortOrder} testID="ratings-sort" />
          </Stack>
        )}
        {renderContent()}
      </Stack>
    </Screen>
  );
}
