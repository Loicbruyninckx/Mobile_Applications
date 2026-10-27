import { CardSkeleton } from './CardSkeleton';
import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Skeleton } from './primitives/Skeleton';
import { Stack } from './primitives/Stack';

/** Grijze placeholders in de vorm van de Home-secties, getoond tijdens het eerste laden. */
export function HomeSkeleton() {
  return (
    <Stack gap="lg" testID="home-skeleton">
      {/* Jouw week */}
      <Skeleton height={120} borderRadius={24} />
      {/* Toppers */}
      <Stack gap="md">
        <Skeleton width="55%" height={22} borderRadius={8} />
        <Row gap="md">
          {[0, 1].map((key) => (
            <Card key={key}>
              <Stack padding="sm" gap="sm">
                <Skeleton width={156} height={156} borderRadius={18} />
                <Skeleton width="80%" height={16} borderRadius={8} />
                <Skeleton width="55%" height={12} borderRadius={8} />
              </Stack>
            </Card>
          ))}
        </Row>
      </Stack>
      {/* Hotspot en feed */}
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </Stack>
  );
}
