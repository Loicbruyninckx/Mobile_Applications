import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getGroup, getGroupMembers } from '../../../src/services/groupService';
import { copyToClipboard } from '../../../src/services/clipboardService';
import { useAuthStore } from '../../../src/state/useAuthStore';
import { Screen } from '../../../src/components/primitives/Screen';
import { Stack } from '../../../src/components/primitives/Stack';
import { Row } from '../../../src/components/primitives/Row';
import { Text } from '../../../src/components/primitives/Text';
import { Card } from '../../../src/components/primitives/Card';
import { Divider } from '../../../src/components/primitives/Divider';
import { EmptyState } from '../../../src/components/primitives/EmptyState';
import { Skeleton } from '../../../src/components/primitives/Skeleton';
import { Toast } from '../../../src/components/primitives/Toast';
import { StyledButton } from '../../../src/components/StyledButton';
import { BackButton } from '../../../src/components/BackButton';
import { MemberRow } from '../../../src/components/MemberRow';
import { CardSkeleton } from '../../../src/components/CardSkeleton';
import { colors } from '../../../src/theme/colors';
import type { Group } from '../../../src/types/Group';
import type { GroupMemberWithProfile } from '../../../src/types/GroupMember';

interface ToastState {
  message: string;
  variant: 'success' | 'error';
}

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    // Bv. als je de link rechtstreeks opende: dan is er geen vorige pagina.
    router.replace('/groepen');
  }
}

export default function GroepsdetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const myUserId = useAuthStore((state) => state.user?.id);

  const [group, setGroup] = useState<Group | undefined>();
  const [members, setMembers] = useState<GroupMemberWithProfile[] | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [toast, setToast] = useState<ToastState | undefined>();

  const load = useCallback(() => {
    setError(undefined);
    Promise.all([getGroup(id), getGroupMembers(id)])
      .then(([loadedGroup, loadedMembers]) => {
        setGroup(loadedGroup);
        setMembers(loadedMembers);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Laden mislukt.'));
  }, [id]);

  // Herladen bij openen, zodat nieuwe leden meteen zichtbaar zijn.
  useFocusEffect(load);

  useEffect(() => {
    if (toast === undefined) return;
    const timer = setTimeout(() => setToast(undefined), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCopy = async () => {
    if (group === undefined) return;
    const copied = await copyToClipboard(group.inviteCode);
    setToast(
      copied
        ? { message: 'Code gekopieerd! Stuur hem naar je vrienden.', variant: 'success' }
        : { message: `Kopiëren lukte niet. De code is ${group.inviteCode}.`, variant: 'error' },
    );
  };

  if (error !== undefined && group === undefined) {
    return (
      <Screen padding="lg">
        <Stack gap="lg">
          <BackButton onPress={goBack} testID="group-back" />
          <EmptyState
            title="Groep niet gevonden"
            description={error}
            action={<StyledButton label="Opnieuw proberen" onPress={load} />}
          />
        </Stack>
      </Screen>
    );
  }

  const memberCount = members?.length ?? 0;

  return (
    <Stack flex={1}>
      <Screen padding="lg">
        <Stack gap="lg">
          <BackButton onPress={goBack} testID="group-back" />

          {group === undefined || members === undefined ? (
            <Stack gap="md">
              <Skeleton width="60%" height={32} />
              <CardSkeleton />
              <CardSkeleton />
            </Stack>
          ) : (
            <>
              <Stack gap="sm">
                <Text size="xl" weight="bold" color={colors.primary}>{group.name}</Text>
                <Text color={colors.textSecondary}>{memberCount === 1 ? '1 lid' : `${memberCount} leden`}</Text>
              </Stack>

              {/* Uitnodigingscode */}
              <Card>
                <Stack gap="sm" padding="md">
                  <Row gap="md" justify="space-between">
                    <Stack>
                      <Text color={colors.textSecondary}>Uitnodigingscode</Text>
                      {/* Spaties alleen voor de leesbaarheid; kopiëren geeft de code zonder spaties. */}
                      <Text size="xl" weight="bold" color={colors.primary}>
                        {group.inviteCode.split('').join(' ')}
                      </Text>
                    </Stack>
                    <StyledButton label="Kopieer" variant="accent" onPress={handleCopy} testID="copy-code-button" />
                  </Row>
                  <Text size="sm" color={colors.textSecondary}>
                    Vrienden typen deze code in bij Groepen → Groep joinen.
                  </Text>
                </Stack>
              </Card>

              {/* Leden */}
              <Stack gap="md">
                <Text size="lg" weight="bold" color={colors.primary}>Leden</Text>
                <Card>
                  <Stack gap="md" padding="md">
                    {members.map((member, index) => (
                      <Stack key={member.userId} gap="md">
                        {index > 0 && <Divider />}
                        <MemberRow
                          member={member}
                          isCreator={member.userId === group.createdBy}
                          isMe={member.userId === myUserId}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </>
          )}
        </Stack>
      </Screen>

      <Toast visible={toast !== undefined} message={toast?.message ?? ''} variant={toast?.variant} testID="group-toast" />
    </Stack>
  );
}
