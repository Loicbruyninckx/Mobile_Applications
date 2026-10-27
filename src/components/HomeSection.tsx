import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface HomeSectionProps {
  title: string;
  /** Klein grijs tekstje rechts naast de titel, bv. "in je groepen". */
  aside?: React.ReactNode;
  children: React.ReactNode;
  testID?: string;
}

/** Een blok op Home met een titel ("Toppers deze week", "Recent"...) en inhoud. */
export function HomeSection({ title, aside, children, testID }: HomeSectionProps) {
  return (
    <Stack gap="md" testID={testID}>
      <Row justify="space-between" gap="md">
        <Text size="lg" weight="bold" font="display">{title}</Text>
        {aside !== undefined && (
          // flexShrink: lange inhoud (bv. veel filterknoppen) krimpt en scrollt i.p.v. buiten het scherm te lopen.
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
