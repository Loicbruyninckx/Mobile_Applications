import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Avatar } from './primitives/Avatar';
import { Text } from './primitives/Text';

interface AvatarStackProps {
  names: string[];
  max?: number;
}

export function AvatarStack({ names, max = 2 }: AvatarStackProps) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="image"
      accessibilityLabel={names.length === 1 ? '1 lid' : `${names.length} leden`}
    >
      {shown.map((name, index) => (
        <View key={`${name}-${index}`} style={[styles.item, index > 0 && styles.overlap]}>
          <Avatar name={name} size="md" />
        </View>
      ))}
      {rest > 0 && (
        <View style={[styles.item, styles.overlap, styles.rest]}>
          <Text weight="bold" color={colors.onAccent}>+{rest}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  item: { borderRadius: 999, borderWidth: 3, borderColor: colors.background },
  overlap: { marginLeft: -14 },
  rest: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent },
});
