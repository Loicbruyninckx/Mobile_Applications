import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface HomeSectionProps {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  testID?: string;
}

export function HomeSection({ title, aside, children, testID }: HomeSectionProps) {
  return (
    <Stack gap="md" testID={testID}>
      <Row justify="space-between" gap="md">
        <Text size="lg" weight="bold" font="display">{title}</Text>
        {aside !== undefined && (
          <View style={styles.aside}>
            {typeof aside === 'string' ? <Text size="sm" color={colors.textSecondary}>{aside}</Text> : aside}
          </View>
        )}
      </Row>
      {children}
    </Stack>
  );
}

const styles = StyleSheet.create({
  aside: { flexShrink: 1 },
});
