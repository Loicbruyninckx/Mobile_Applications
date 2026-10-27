import { useCallback, useMemo, useRef, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { getHomeData } from '../../src/services/homeService';
import { useAuthStore } from '../../src/state/useAuthStore';
import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Row } from '../../src/components/primitives/Row';
import { EmptyState } from '../../src/components/primitives/EmptyState';
import { StyledButton } from '../../src/components/StyledButton';
import { ChoiceChip } from '../../src/components/ChoiceChip';
import { FeedCard } from '../../src/components/FeedCard';
import { HomeHeader } from '../../src/components/HomeHeader';
import { HomeSection } from '../../src/components/HomeSection';
import { HomeSkeleton } from '../../src/components/HomeSkeleton';
import { ActiveFriends } from '../../src/components/ActiveFriends';
import { WeekStats } from '../../src/components/WeekStats';
import { TopBeerCard } from '../../src/components/TopBeerCard';
import { HotspotCard } from '../../src/components/HotspotCard';
import { formatDayPart } from '../../src/utils/formatDate';
import type { HomeData, HomeFeedRating } from '../../src/types/Home';

/** 'all' = alle groepen, anders het id van één groep. */
type GroupFilter = 'all' | string;

export default function HomeScreen() {
  const myUserId = useAuthStore((state) => state.user?.id);
  const myName = useAuthStore((state) => state.user?.username);
  // undefined = nog nooit geladen → skeletons tonen.
  const [data, setData] = useState<HomeData | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<GroupFilter>('all');
  // Telt de laadbeurten: komt een oud antwoord later binnen dan een nieuw, dan negeren we het.
  const requestId = useRef(0);

  const load = useCallback((showSpinner: boolean) => {
    const id = ++requestId.current;
    setError(undefined);
    if (showSpinner) setRefreshing(true);

    getHomeData()
      .then((result) => {
        if (id !== requestId.current) return;
        setData(result);
        // Groep verlaten of verwijderd? Dan terug naar "Alles".
        setFilter((current) => (current === 'all' || result.groups.some((g) => g.id === current) ? current : 'all'));
      })
      .catch((e: unknown) => {
        if (id !== requestId.current) return;
        setError(e instanceof Error ? e.message : 'Laden mislukt.');
      })
      .finally(() => {
        if (id === requestId.current) setRefreshing(false);
      });
  }, []);

  // Herladen telkens je naar Home gaat (zonder spinner: de oude data blijft staan).
  useFocusEffect(useCallback(() => load(false), [load]));
  const refresh = useCallback(() => load(true), [load]);

  const groupNames = useMemo(() => new Map((data?.groups ?? []).map((group) => [group.id, group.name])), [data]);

  const visibleFeed = useMemo(() => {
    if (data === undefined) return [];
    return filter === 'all' ? data.feed : data.feed.filter((rating) => rating.groupIds.includes(filter));
  }, [data, filter]);

  /** Bij "Alles" tonen we in welke groep(en) de rating staat; bij één groep is dat overbodig. */
  const groupLabel = (rating: HomeFeedRating): string | undefined => {
    if (filter !== 'all') return undefined;
    return rating.groupIds.flatMap((id) => groupNames.get(id) ?? []).join(', ');
  };

  const renderFeed = (home: HomeData) => {
    if (visibleFeed.length === 0) {
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
        {visibleFeed.map((rating) => (
          <FeedCard
            key={rating.id}
            rating={rating}
            imageUri={rating.imageUri}
            groupLabel={home.groups.length > 1 ? groupLabel(rating) : undefined}
            isMine={rating.userId === myUserId}
            testID="feed-card"
          />
        ))}
      </Stack>
    );
  };

  const renderContent = () => {
    if (error !== undefined && data === undefined) {
      return (
        <EmptyState
          title="Er ging iets mis"
          description={error}
          action={<StyledButton label="Opnieuw proberen" onPress={refresh} testID="feed-retry" />}
        />
      );
    }

    if (data === undefined) return <HomeSkeleton />;

    return (
      <Stack gap="lg">
        {data.activeFriends.length > 0 && <ActiveFriends friends={data.activeFriends} testID="home-active" />}

        <WeekStats stats={data.week} onTopPress={() => router.navigate('/mijn-ratings')} testID="home-week" />

        {data.groups.length === 0 ? (
          <EmptyState
            title="Je zit nog in geen groep"
            description="Maak een groep met je vrienden of join er een met een code. Dan zie je hier wat zij drinken."
            action={<StyledButton label="Naar groepen" onPress={() => router.navigate('/groepen')} testID="feed-to-groups" />}
          />
        ) : (
          <>
            <HomeSection title="Toppers deze week" aside="in je groepen" testID="home-tops">
              {data.topBeers.length === 0 ? (
                <EmptyState
                  title="Nog geen toppers deze week"
                  description="Een bier komt hier zodra het minstens 2 keer geraten is. Tijd voor een pint?"
                />
              ) : (
                <Row gap="md" align="flex-start" scroll>
                  {data.topBeers.map((top) => (
                    <TopBeerCard key={top.beer.id} top={top} testID={`top-beer-${top.rank}`} />
                  ))}
                </Row>
              )}
            </HomeSection>

            {data.hotspot !== undefined && (
              <HotspotCard
                hotspot={data.hotspot}
                onPress={() => {
                  if (data.hotspot !== undefined) {
                    router.push({ pathname: '/groepen/[id]', params: { id: data.hotspot.groupId } });
                  }
                }}
                testID="home-hotspot"
              />
            )}

            <HomeSection
              title="Recent"
              aside={
                <Row gap="sm" scroll>
                  <ChoiceChip
                    label="Alles"
                    variant="accent"
                    selected={filter === 'all'}
                    onPress={() => setFilter('all')}
                    testID="feed-filter-all"
                  />
                  {data.groups.map((group) => (
                    <ChoiceChip
                      key={group.id}
                      label={group.name}
                      variant="accent"
                      selected={filter === group.id}
                      onPress={() => setFilter(group.id)}
                      testID={`feed-filter-${group.id}`}
                    />
                  ))}
                </Row>
              }
              testID="home-feed"
            >
              {renderFeed(data)}
            </HomeSection>
          </>
        )}
      </Stack>
    );
  };

  return (
    <Screen padding="lg" onRefresh={refresh} refreshing={refreshing} testID="home-screen">
      <Stack gap="lg">
        <HomeHeader dayPart={formatDayPart()} username={myName} onAvatarPress={() => router.navigate('/profiel')} />
        {renderContent()}
      </Stack>
    </Screen>
  );
}
