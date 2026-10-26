import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import {
  createGroup,
  getMyGroups,
  GROUP_NAME_MAX,
  INVITE_CODE_LENGTH,
  joinGroupByCode,
  normalizeInviteCode,
} from '../../../src/services/groupService';
import { Screen } from '../../../src/components/primitives/Screen';
import { Stack } from '../../../src/components/primitives/Stack';
import { Row } from '../../../src/components/primitives/Row';
import { Text } from '../../../src/components/primitives/Text';
import { Card } from '../../../src/components/primitives/Card';
import { InputField } from '../../../src/components/primitives/InputField';
import { EmptyState } from '../../../src/components/primitives/EmptyState';
import { StyledButton } from '../../../src/components/StyledButton';
import { ChoiceCard } from '../../../src/components/ChoiceCard';
import { CardSkeleton } from '../../../src/components/CardSkeleton';
import { colors } from '../../../src/theme/colors';
import type { GroupWithMemberCount } from '../../../src/types/Group';

function openGroup(id: string) {
  router.push({ pathname: '/groepen/[id]', params: { id } });
}

export default function GroepenScreen() {
  // undefined = nog nooit geladen → skeletons tonen.
  const [groups, setGroups] = useState<GroupWithMemberCount[] | undefined>();
  const [loadError, setLoadError] = useState<string | undefined>();

  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | undefined>();

  // undefined = formulier "Nieuwe groep" is dicht.
  const [newGroupName, setNewGroupName] = useState<string | undefined>();
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | undefined>();

  const load = useCallback(() => {
    setLoadError(undefined);
    getMyGroups()
      .then(setGroups)
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : 'Laden mislukt.'));
  }, []);

  // Herladen telkens je naar deze tab of terug naar de lijst gaat.
  useFocusEffect(load);

  const handleJoin = async () => {
    setJoinError(undefined);
    setIsJoining(true);
    try {
      const groupId = await joinGroupByCode(joinCode);
      setJoinCode('');
      openGroup(groupId);
    } catch (e) {
      setJoinError(e instanceof Error ? e.message : 'Joinen mislukt.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreate = async () => {
    if (newGroupName === undefined) return;
    setCreateError(undefined);
    setIsCreating(true);
    try {
      const group = await createGroup(newGroupName);
      setNewGroupName(undefined);
      // Meteen naar het detail, waar de uitnodigingscode staat om te delen.
      openGroup(group.id);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Aanmaken mislukt.');
    } finally {
      setIsCreating(false);
    }
  };

  const renderGroups = () => {
    if (loadError !== undefined && groups === undefined) {
      return (
        <EmptyState
          title="Er ging iets mis"
          description={loadError}
          action={<StyledButton label="Opnieuw proberen" onPress={load} testID="groups-retry" />}
        />
      );
    }
    if (groups === undefined) {
      return (
        <Stack gap="md">
          <CardSkeleton />
          <CardSkeleton />
        </Stack>
      );
    }
    if (groups.length === 0) {
      return (
        <EmptyState
          title="Nog geen groepen"
          description="Maak een groep voor je vriendengroep, of join er een met de code die je van een vriend kreeg."
        />
      );
    }
    return (
      <Stack gap="md">
        {groups.map((group) => (
          <ChoiceCard
            key={group.id}
            title={group.name}
            subtitle={group.memberCount === 1 ? '1 lid' : `${group.memberCount} leden`}
            icon="people-outline"
            trailingIcon="chevron-forward"
            onPress={() => openGroup(group.id)}
            testID="group-card"
          />
        ))}
      </Stack>
    );
  };

  return (
    <Screen padding="lg">
      <Stack gap="lg">
        <Text size="xl" weight="bold" color={colors.primary}>Groepen</Text>

        {/* Joinen met een code */}
        <Card>
          <Stack gap="sm" padding="md">
            <Row gap="sm" align="flex-end">
              <Stack flex={1}>
                <InputField
                  label="Groep joinen met een code"
                  value={joinCode}
                  onChangeText={(text) => setJoinCode(normalizeInviteCode(text))}
                  placeholder="bv. K7P2QX"
                  autoCapitalize="characters"
                  maxLength={INVITE_CODE_LENGTH}
                  testID="join-code-input"
                />
              </Stack>
              <StyledButton label="Join" onPress={handleJoin} isLoading={isJoining} testID="join-button" />
            </Row>
            {joinError !== undefined && <Text color={colors.error}>{joinError}</Text>}
          </Stack>
        </Card>

        {/* Mijn groepen */}
        <Stack gap="md">
          <Row justify="space-between" gap="md">
            <Text size="lg" weight="bold" color={colors.primary}>Mijn groepen</Text>
            {newGroupName === undefined && (
              <StyledButton
                label="+ Nieuwe groep"
                variant="secondary"
                onPress={() => setNewGroupName('')}
                testID="new-group-button"
              />
            )}
          </Row>

          {newGroupName !== undefined && (
            <Card highlighted>
              <Stack gap="md" padding="md">
                <InputField
                  label="Naam van je groep"
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                  placeholder="bv. De Leuvense Tripelaars"
                  autoCapitalize="words"
                  maxLength={GROUP_NAME_MAX}
                  testID="new-group-name"
                />
                <Text size="sm" color={colors.textSecondary}>
                  Je groep krijgt automatisch een uitnodigingscode van 6 tekens.
                </Text>
                {createError !== undefined && <Text color={colors.error}>{createError}</Text>}
                <StyledButton label="Groep aanmaken" onPress={handleCreate} isLoading={isCreating} testID="create-group-button" />
                <StyledButton
                  label="Annuleren"
                  variant="secondary"
                  onPress={() => {
                    setNewGroupName(undefined);
                    setCreateError(undefined);
                  }}
                />
              </Stack>
            </Card>
          )}

          {renderGroups()}
        </Stack>
      </Stack>
    </Screen>
  );
}
