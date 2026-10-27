import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import type { ActiveFriend } from '../types/Home';
import { Avatar } from './primitives/Avatar';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface ActiveFriendsProps {
  friends: ActiveFriend[];
  testID?: string;
}

/** "Nu actief": wie de laatste 3 uur iets raatte, met het café eronder. Scrollt opzij. */
export function ActiveFriends({ friends, testID }: ActiveFriendsProps) {
  return (
    <Stack gap="md" testID={testID}>
      <Row gap="sm">
        <View style={styles.dot} />
        <Text weight="bold">Nu actief</Text>
        <Text size="sm" color={colors.textSecondary}>· rating in de laatste 3 uur</Text>
      </Row>
      <Row gap="md" align="flex-start" scroll>
        {friends.map((friend) => (
          <View key={friend.userId} style={styles.friend} testID={`active-friend-${friend.userId}`}>
            <Avatar name={friend.username} uri={friend.avatarUri} size="lg" ring />
            <Text size="sm" weight="bold" align="center" numberOfLines={1}>{friend.username}</Text>
            {friend.cafeName !== undefined && (
              <Text size="sm" align="center" color={colors.textSecondary} numberOfLines={1}>{friend.cafeName}</Text>
            )}
          </View>
        ))}
      </Row>
    </Stack>
  );
}

const styles = StyleSheet.create({
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  friend: { width: 72, alignItems: 'center', gap: 4 },
});
