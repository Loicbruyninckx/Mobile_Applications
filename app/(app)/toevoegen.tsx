import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { addRating, RatingShareError, searchBeers, searchCafes } from '../../src/services/ratingService';
import { getMyGroups } from '../../src/services/groupService';
import { useSearch } from '../../src/hooks/useSearch';
import { Screen } from '../../src/components/primitives/Screen';
import { Stack } from '../../src/components/primitives/Stack';
import { Row } from '../../src/components/primitives/Row';
import { Text } from '../../src/components/primitives/Text';
import { Card } from '../../src/components/primitives/Card';
import { InputField } from '../../src/components/primitives/InputField';
import { Toast } from '../../src/components/primitives/Toast';
import { StyledButton } from '../../src/components/StyledButton';
import { SCORE_LABELS, StarRating } from '../../src/components/StarRating';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ChoiceCard } from '../../src/components/ChoiceCard';
import { ChoiceChip } from '../../src/components/ChoiceChip';
import { SearchPicker } from '../../src/components/SearchPicker';
import { colors } from '../../src/theme/colors';
import type { Beer, NewBeer } from '../../src/types/Beer';
import type { Cafe } from '../../src/types/Cafe';
import type { Group } from '../../src/types/Group';
import type { BeerChoice, CafeChoice, Score } from '../../src/types/Rating';

const REVIEW_MAX = 500;

interface BeerForm {
  name: string;
  brewery: string;
  style: string;
  abv: string;
}

interface CafeForm {
  name: string;
  city: string;
}

interface ToastState {
  message: string;
  variant: 'success' | 'error';
}

function beerSubtitle(beer: { brewery?: string; style?: string; abv?: number }): string | undefined {
  const parts = [beer.brewery, beer.style, beer.abv !== undefined ? `${String(beer.abv).replace('.', ',')}%` : undefined];
  const text = parts.filter((part) => part !== undefined && part !== '').join(' · ');
  return text !== '' ? text : undefined;
}

function parseAbv(text: string): { abv?: number; error?: string } {
  const clean = text.trim().replace(',', '.');
  if (clean === '') return {};
  const abv = Number(clean);
  if (!Number.isFinite(abv) || abv < 0 || abv > 100) {
    return { error: 'Alcohol % moet een getal tussen 0 en 100 zijn.' };
  }
  return { abv: Math.round(abv * 10) / 10 };
}

export default function ToevoegenScreen() {
  const [beerQuery, setBeerQuery] = useState('');
  const [beerChoice, setBeerChoice] = useState<BeerChoice | undefined>();
  const [beerForm, setBeerForm] = useState<BeerForm | undefined>();
  const [beerFormError, setBeerFormError] = useState<string | undefined>();
  const beerSearch = useSearch<Beer>(beerQuery, searchBeers);

  const [score, setScore] = useState<Score | undefined>();
  const [review, setReview] = useState('');

  const [cafeQuery, setCafeQuery] = useState('');
  const [cafeChoice, setCafeChoice] = useState<CafeChoice | undefined>();
  const [cafeForm, setCafeForm] = useState<CafeForm | undefined>();
  const [cafeFormError, setCafeFormError] = useState<string | undefined>();
  const cafeSearch = useSearch<Cafe>(cafeQuery, searchCafes);

  const [groups, setGroups] = useState<Group[]>([]);
  const [unselectedGroupIds, setUnselectedGroupIds] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [toast, setToast] = useState<ToastState | undefined>();

  useFocusEffect(
    useCallback(() => {
      getMyGroups()
        .then(setGroups)
        .catch(() => setGroups([]));
    }, []),
  );

  useEffect(() => {
    if (toast === undefined) return;
    const timer = setTimeout(() => setToast(undefined), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggleGroup = (groupId: string) => {
    setUnselectedGroupIds((ids) =>
      ids.includes(groupId) ? ids.filter((id) => id !== groupId) : [...ids, groupId],
    );
  };

  const selectBeer = (id: string) => {
    const beer = beerSearch.results.find((b) => b.id === id);
    if (beer !== undefined) setBeerChoice({ kind: 'existing', beer });
  };

  const confirmNewBeer = () => {
    if (beerForm === undefined) return;
    if (beerForm.name.trim() === '') {
      setBeerFormError('Geef het bier een naam.');
      return;
    }
    const { abv, error: abvError } = parseAbv(beerForm.abv);
    if (abvError !== undefined) {
      setBeerFormError(abvError);
      return;
    }
    const newBeer: NewBeer = {
      name: beerForm.name.trim(),
      brewery: beerForm.brewery.trim() || undefined,
      style: beerForm.style.trim() || undefined,
      abv,
    };
    setBeerChoice({ kind: 'new', beer: newBeer });
    setBeerForm(undefined);
    setBeerFormError(undefined);
  };

  const selectCafe = (id: string) => {
    const cafe = cafeSearch.results.find((c) => c.id === id);
    if (cafe !== undefined) setCafeChoice({ kind: 'existing', cafe });
  };

  const confirmNewCafe = () => {
    if (cafeForm === undefined) return;
    if (cafeForm.name.trim() === '' || cafeForm.city.trim() === '') {
      setCafeFormError('Vul de naam en de stad van het café in.');
      return;
    }
    setCafeChoice({ kind: 'new', cafe: { name: cafeForm.name.trim(), city: cafeForm.city.trim() } });
    setCafeForm(undefined);
    setCafeFormError(undefined);
  };

  const resetForm = () => {
    setBeerQuery('');
    setBeerChoice(undefined);
    setBeerForm(undefined);
    setScore(undefined);
    setReview('');
    setCafeQuery('');
    setCafeChoice(undefined);
    setCafeForm(undefined);
    setError(undefined);
  };

  const handleClose = () => {
    resetForm();
    router.navigate('/');
  };

  const handleSave = async () => {
    setError(undefined);
    if (beerChoice === undefined) {
      setError('Kies eerst een bier.');
      return;
    }
    if (score === undefined) {
      setError('Geef een score van 1 tot 5 sterren.');
      return;
    }

    setIsSaving(true);
    try {
      await addRating({
        beer: beerChoice,
        cafe: cafeChoice,
        score,
        review,
        groupIds: groups.map((g) => g.id).filter((id) => !unselectedGroupIds.includes(id)),
      });
      resetForm();
      setToast({ message: 'Rating opgeslagen! 🍺', variant: 'success' });
    } catch (e) {
      if (e instanceof RatingShareError) {
        resetForm();
        setToast({ message: e.message, variant: 'error' });
      } else {
        setError(e instanceof Error ? e.message : 'Opslaan mislukt. Probeer opnieuw.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack flex={1}>
      <Screen padding="lg">
        <Stack gap="lg">
          <Stack gap="md">
            <ScreenHeader title="Nieuwe rating" onButtonPress={handleClose} buttonLabel="Sluiten" testID="rating-close" />
            <Text size="xxl" weight="bold">
              Wat drink <Text size="xxl" weight="bold" color={colors.accent}>je?</Text>
            </Text>
            <Text size="sm" color={colors.textSecondary}>
              Velden met <Text size="sm" weight="bold" color={colors.accent}>*</Text> zijn verplicht.
            </Text>
          </Stack>

          {beerChoice !== undefined ? (
            <ChoiceCard
              title={beerChoice.beer.name}
              subtitle={beerSubtitle(beerChoice.beer) ?? (beerChoice.kind === 'new' ? 'Nieuw bier' : undefined)}
              icon="beer-outline"
              actionLabel="Wijzig"
              selected
              onPress={() => setBeerChoice(undefined)}
              testID="beer-selected"
            />
          ) : beerForm !== undefined ? (
            <Card highlighted>
              <Stack gap="md" padding="md">
                <Text size="lg" weight="bold" font="display">Nieuw bier</Text>
                <InputField
                  label="Naam"
                  required
                  value={beerForm.name}
                  onChangeText={(name) => setBeerForm({ ...beerForm, name })}
                  autoCapitalize="words"
                  testID="new-beer-name"
                />
                <InputField
                  label="Brouwerij (optioneel)"
                  value={beerForm.brewery}
                  onChangeText={(brewery) => setBeerForm({ ...beerForm, brewery })}
                  autoCapitalize="words"
                  testID="new-beer-brewery"
                />
                <Row gap="md">
                  <Stack flex={2}>
                    <InputField
                      label="Stijl (optioneel)"
                      value={beerForm.style}
                      onChangeText={(style) => setBeerForm({ ...beerForm, style })}
                      placeholder="bv. Tripel"
                      autoCapitalize="words"
                      testID="new-beer-style"
                    />
                  </Stack>
                  <Stack flex={1}>
                    <InputField
                      label="Alcohol %"
                      value={beerForm.abv}
                      onChangeText={(abv) => setBeerForm({ ...beerForm, abv })}
                      placeholder="9,5"
                      keyboardType="decimal-pad"
                      testID="new-beer-abv"
                    />
                  </Stack>
                </Row>
                {beerFormError !== undefined && <Text color={colors.error}>{beerFormError}</Text>}
                <StyledButton label="Gebruik dit bier" onPress={confirmNewBeer} testID="new-beer-confirm" />
                <StyledButton
                  label="Annuleren"
                  variant="secondary"
                  onPress={() => {
                    setBeerForm(undefined);
                    setBeerFormError(undefined);
                  }}
                />
              </Stack>
            </Card>
          ) : (
            <SearchPicker
              label="Welk bier?"
              required
              placeholder="Zoek bier of brouwerij…"
              query={beerQuery}
              onQueryChange={setBeerQuery}
              results={beerSearch.results.map((beer) => ({
                id: beer.id,
                title: beer.name,
                subtitle: beerSubtitle(beer),
              }))}
              isSearching={beerSearch.isSearching}
              error={beerSearch.error}
              icon="beer-outline"
              inputIcon="search"
              onSelect={selectBeer}
              addLabel="Nieuw bier toevoegen"
              onAdd={() => setBeerForm({ name: beerQuery.trim(), brewery: '', style: '', abv: '' })}
              testID="beer"
            />
          )}

          <Stack gap="sm">
            <Row justify="space-between">
              <Text size="lg" weight="medium" color={colors.textSecondary}>
                Jouw score <Text size="lg" weight="bold" color={colors.accent}>*</Text>
              </Text>
              {score !== undefined && (
                <Text size="lg" weight="bold" color={colors.accent}>{score}/5 · {SCORE_LABELS[score]}</Text>
              )}
            </Row>
            <StarRating value={score} onChange={setScore} testID="star" />
          </Stack>

          <InputField
            label="Review (optioneel)"
            showLabel={false}
            value={review}
            onChangeText={setReview}
            placeholder="Hoe smaakt hij? (optioneel)"
            multiline
            maxLength={REVIEW_MAX}
            autoCapitalize="sentences"
            testID="review-input"
          />

          {cafeChoice !== undefined ? (
            <ChoiceCard
              title={cafeChoice.cafe.name}
              subtitle={cafeChoice.cafe.city}
              icon="location-outline"
              actionLabel="Wijzig"
              selected
              onPress={() => setCafeChoice(undefined)}
              testID="cafe-selected"
            />
          ) : cafeForm !== undefined ? (
            <Card highlighted>
              <Stack gap="md" padding="md">
                <Text size="lg" weight="bold" font="display">Nieuw café</Text>
                <InputField
                  label="Naam"
                  required
                  value={cafeForm.name}
                  onChangeText={(name) => setCafeForm({ ...cafeForm, name })}
                  autoCapitalize="words"
                  testID="new-cafe-name"
                />
                <InputField
                  label="Stad"
                  required
                  value={cafeForm.city}
                  onChangeText={(city) => setCafeForm({ ...cafeForm, city })}
                  placeholder="bv. Leuven"
                  autoCapitalize="words"
                  testID="new-cafe-city"
                />
                {cafeFormError !== undefined && <Text color={colors.error}>{cafeFormError}</Text>}
                <StyledButton label="Gebruik dit café" onPress={confirmNewCafe} testID="new-cafe-confirm" />
                <StyledButton
                  label="Annuleren"
                  variant="secondary"
                  onPress={() => {
                    setCafeForm(undefined);
                    setCafeFormError(undefined);
                  }}
                />
              </Stack>
            </Card>
          ) : (
            <SearchPicker
              label="Café (optioneel)"
              placeholder="In welk café?"
              query={cafeQuery}
              onQueryChange={setCafeQuery}
              results={cafeSearch.results.map((cafe) => ({
                id: cafe.id,
                title: cafe.name,
                subtitle: cafe.city,
              }))}
              isSearching={cafeSearch.isSearching}
              error={cafeSearch.error}
              icon="location-outline"
              inputIcon="location-outline"
              onSelect={selectCafe}
              addLabel="Nieuw café toevoegen"
              onAdd={() => setCafeForm({ name: cafeQuery.trim(), city: '' })}
              testID="cafe"
            />
          )}

          {groups.length === 0 ? (
            <Text color={colors.textSecondary}>
              Je zit nog in geen groep. Deze rating is alleen voor jou zichtbaar.
            </Text>
          ) : (
            <Row gap="sm" wrap>
              <Text size="lg" weight="medium" color={colors.textSecondary}>Deel met</Text>
              {groups.map((group) => (
                <ChoiceChip
                  key={group.id}
                  label={group.name}
                  selected={!unselectedGroupIds.includes(group.id)}
                  onPress={() => toggleGroup(group.id)}
                  testID={`group-chip-${group.id}`}
                />
              ))}
            </Row>
          )}
        </Stack>
      </Screen>

      <Stack padding="lg" gap="sm">
        {error !== undefined && (
          <Text color={colors.error} weight="medium" align="center" testID="rating-error">
            {error}
          </Text>
        )}
        <StyledButton label="Post rating" onPress={handleSave} isLoading={isSaving} size="lg" testID="save-rating-button" />
      </Stack>

      <Toast
        visible={toast !== undefined}
        message={toast?.message ?? ''}
        variant={toast?.variant}
        testID="rating-toast"
      />
    </Stack>
  );
}
