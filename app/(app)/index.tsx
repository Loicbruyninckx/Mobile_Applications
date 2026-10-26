import { useCallback, useMemo, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { getMyGroups } from '../../src/services/groupService';
import { getGroupFeed } from '../../src/services/ratingService';
import { useAuthStore } from '../../src/state/useAuthStore';
import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Row } from '../../src/components/primitives/Row';
import { Text } from '../../src/components/primitives/Text';
import { EmptyState } from '../../src/components/primitives/EmptyState';
import { StyledButton } from '../../src/components/StyledButton';
import { ChoiceChip } from '../../src/components/ChoiceChip';
import { FeedCard } from '../../src/components/FeedCard';
import { CardSkeleton } from '../../src/components/CardSkeleton';
import { colors } from '../../src/theme/colors';
import type { Group } from '../../src/types/Group';
import type { FeedRating } from '../../src/types/Rating';

/** 'all' = alle groepen, anders het id van één groep. */
type GroupFilter = 'all' | string;

interface FeedData {
  groups: Group[];
  ratings: FeedRating[];
}

export default function HomeScreen() {
  const myUserId = useAuthStore((state) => state.user?.id);
  // undefined = nog nooit geladen → skeletons tonen.
  const [feed, setFeed] = useState<FeedData | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [filter, setFilter] = useState<GroupFilter>('all');

  const load = useCallback(() => {
    setError(undefined);
    getMyGroups()
      .then(async (groups) => {
        const ratings = await getGroupFeed(groups.map((group) => group.id));
        setFeed({ groups, ratings });
        // Groep verlaten of verwijderd? Dan terug naar "Alle groepen".
        setFilter((current) => (current === 'all' || groups.some((g) => g.id === current) ? current : 'all'));
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Laden mislukt.'));
  }, []);

  // Herladen telkens je naar Home gaat, zodat nieuwe ratings van vrienden verschijnen.
  useFocusEffect(load);

  const groupNames = useMemo(
    () => new Map((feed?.groups ?? []).map((group) => [group.id, group.name])),
    [feed],
  );

  const visibleRatings = useMemo(() => {
    if (feed === undefined) return [];
    return filter === 'all' ? feed.ratings : feed.ratings.filter((rating) => rating.groupIds.includes(filter));
  }, [feed, filter]);

  /** Bij "Alle groepen" tonen we in welke groep(en) de rating staat; bij één groep is dat overbodig. */
  const groupLabel = (rating: FeedRating): string | undefined => {
    if (filter !== 'all') return undefined;
    const names = rating.groupIds.flatMap((id) => {
      const name = groupNames.get(id);
      return name !== undefined ? [name] : [];
    });
    return names.join(', ');
  };

  const renderContent = () => {
    if (error !== undefined && feed === undefined) {
      return (
        <EmptyState
          title="Er ging iets mis"
          description={error}
          action={<StyledButton label="Opnieuw proberen" onPress={load} testID="feed-retry" />}
        />
      );
    }

    if (feed === undefined) {
      return (
        <Stack gap="md">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </Stack>
      );
    }

    if (feed.groups.length === 0) {
      return (
        <EmptyState
          title="Je zit nog in geen groep"
          description="Maak een groep met je vrienden of join er een met een code. Dan zie je hier wat zij drinken."
          action={<StyledButton label="Naar groepen" onPress={() => router.navigate('/groepen')} testID="feed-to-groups" />}
        />
      );
    }

    if (visibleRatings.length === 0) {
      return (
        <EmptyState
          title="Nog geen ratings"
          description="Zodra iemand in je groep een bier raat, verschijnt het hier. Begin zelf!"
          action={<StyledButton label="Rate een bier" onPress={() => router.navigate('/toevoegen')} testID="feed-add" />}
        />
      );
    }

    return (
      <Stack gap="md">
        {visibleRatings.map((rating) => (
          <FeedCard
            key={rating.id}
            rating={rating}
            groupLabel={groupLabel(rating)}
            isMine={rating.userId === myUserId}
            testID="feed-card"
          />
        ))}
      </Stack>
    );
  };

  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Text size="xl" weight="bold" color={colors.primary}>Home</Text>

        {/* Filter per groep: alleen zinvol vanaf 2 groepen. */}
        {feed !== undefined && feed.groups.length > 1 && (
          <Row gap="sm" wrap>
            <ChoiceChip label="Alle groepen" selected={filter === 'all'} onPress={() => setFilter('all')} testID="feed-filter-all" />
            {feed.groups.map((group) => (
              <ChoiceChip
                key={group.id}
                label={group.name}
                selected={filter === group.id}
                onPress={() => setFilter(group.id)}
                testID={`feed-filter-${group.id}`}
              />
            ))}
          </Row>
        )}

        {renderContent()}
      </Stack>
    </Screen>
  );
}
