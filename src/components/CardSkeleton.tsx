import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Skeleton } from './primitives/Skeleton';
import { Stack } from './primitives/Stack';

/** Grijze placeholder in de vorm van een lijstkaart (icoon + 2 regels), getoond tijdens het laden. */
export function CardSkeleton() {
  return (
    <Card>
      <Stack gap="sm" padding="md">
        <Row gap="md">
          <Skeleton width={52} height={52} borderRadius={12} />
          <Stack flex={1} gap="sm">
            <Skeleton width="70%" height={18} />
            <Skeleton width="45%" height={14} />
          </Stack>
        </Row>
      </Stack>
    </Card>
  );
}
