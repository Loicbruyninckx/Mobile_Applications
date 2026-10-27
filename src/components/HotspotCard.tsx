import { colors } from '../theme/colors';
import type { Hotspot } from '../types/Home';
import { formatScore } from '../utils/formatScore';
import { Card } from './primitives/Card';
import { Icon } from './primitives/Icon';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { PhotoBox } from './PhotoBox';

interface HotspotCardProps {
  hotspot: Hotspot;
  onPress: () => void;
  testID?: string;
}

/** "Hotspot van de week": het best gescoorde café. Tik = naar de groep waar het het meest geratet werd. */
export function HotspotCard({ hotspot, onPress, testID }: HotspotCardProps) {
  const ratings = hotspot.groupRatingCount === 1 ? 'rating' : 'ratings';

  return (
    <Card onPress={onPress} testID={testID}>
      <Stack padding="md">
        <Row gap="md">
          <PhotoBox size={72} placeholderIcon="location-outline" />
          <Stack flex={1} gap="none">
            <Text size="sm" weight="bold" color={colors.accent}>HOTSPOT VAN DE WEEK</Text>
            <Text size="lg" weight="bold" font="display" numberOfLines={1} testID={testID !== undefined ? `${testID}-name` : undefined}>
              {hotspot.cafe.name}
            </Text>
            <Text size="sm" color={colors.textSecondary}>
              ★ {formatScore(hotspot.averageScore)} gemiddeld · {hotspot.groupRatingCount} {ratings} in {hotspot.groupName}
            </Text>
          </Stack>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </Row>
      </Stack>
    </Card>
  );
}
