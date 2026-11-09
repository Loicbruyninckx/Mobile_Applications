import { useCallback, useEffect, useState } from 'react';
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
import { Toast } from '../../../src/components/primitives/Toast';
import { StyledButton } from '../../../src/components/StyledButton';
import { GroupCard } from '../../../src/components/GroupCard';
import { CardSkeleton } from '../../../src/components/CardSkeleton';
import { colors } from '../../../src/theme/colors';
import type { GroupWithMemberCount } from '../../../src/types/Group';

interface ToastState {
  message: string;
  variant: 'default' | 'success';
}

function openGroup(id: string) {
  router.push({ pathname: '/groepen/[id]', params: { id } });
}

export default function GroepenScreen() {
  const [groups, setGroups] = useState<GroupWithMemberCount[] | undefined>();
  const [loadError, setLoadError] = useState<string | undefined>();

  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | undefined>();
  const [toast, setToast] = useState<ToastState | undefined>();

  const [newGroupName, setNewGroupName] = useState<string | undefined>();
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | undefined>();

  const load = useCallback(() => {
    setLoadError(undefined);
    getMyGroups()
      .then(setGroups)
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : 'Laden mislukt.'));
  }, []);

  useFocusEffect(load);

  useEffect(() => {
    if (toast === undefined) return;
    const timer = setTimeout(() => setToast(undefined), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleJoin = async () => {
    setJoinError(undefined);
    setIsJoining(true);
    try {
      const result = await joinGroupByCode(joinCode);
      setJoinCode('');
      setToast(
        result.alreadyMember
          ? { message: `Je bent al lid van ${result.groupName}.`, variant: 'default' }
          : { message: `Je bent lid van ${result.groupName}! 🍻`, variant: 'success' },
      );
      load();
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
        <Stack testID="group-list">
          <EmptyState
            title="Nog geen groepen"
            description="Maak een groep voor je vriendengroep, of join er een met de code die je van een vriend kreeg."
          />
        </Stack>
      );
    }
    return (
      <Stack gap="md" testID="group-list">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            name={group.name}
            memberCount={group.memberCount}
            onPress={() => openGroup(group.id)}
            testID={`group-card-${group.id}`}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Stack flex={1}>
      <Screen padding="lg">
        <Stack gap="lg">
          <Row justify="space-between" gap="md">
            <Text size="xl" weight="bold">Je groepen</Text>
            {newGroupName === undefined && (
              <StyledButton
                label="+ Nieuw"
                variant="secondary"
                onPress={() => setNewGroupName('')}
                testID="new-group-button"
              />
            )}
          </Row>

          <Card variant="accent">
            <Stack gap="md" padding="lg">
              <Stack>
                <Text size="xl" weight="bold" color={colors.onAccent}>Code gekregen?</Text>
                <Text color={colors.onAccent}>Typ hem hier en je zit erin.</Text>
              </Stack>
              <Row gap="sm">
                <Stack flex={1}>
                  <InputField
                    label="Groep joinen met een code"
                    showLabel={false}
                    variant="code"
                    value={joinCode}
                    onChangeText={(text) => setJoinCode(normalizeInviteCode(text))}
                    placeholder="K7P2QX"
                    autoCapitalize="characters"
                    maxLength={INVITE_CODE_LENGTH}
                    testID="join-code-input"
                  />
                </Stack>
                <StyledButton label="Join" variant="dark" onPress={handleJoin} isLoading={isJoining} testID="join-button" />
              </Row>
              {joinError !== undefined && (
                <Text weight="bold" color={colors.onAccent} testID="join-error">
                  ⚠ {joinError}
                </Text>
              )}
            </Stack>
          </Card>

          {newGroupName !== undefined && (
            <Card highlighted>
              <Stack gap="md" padding="lg">
                <Text size="lg" weight="bold" font="display">Nieuwe groep</Text>
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

          <Stack gap="md">
            {renderGroups()}
          </Stack>
        </Stack>
      </Screen>

      <Toast visible={toast !== undefined} message={toast?.message ?? ''} variant={toast?.variant} testID="join-toast" />
    </Stack>
  );
}
