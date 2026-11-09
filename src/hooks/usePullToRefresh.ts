import { useRef, useState } from 'react';
import { Platform, type GestureResponderEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

const THRESHOLD = 70;
const MAX_PULL = 100;
const RESISTANCE = 0.5;

export function usePullToRefresh(onRefresh: (() => void) | undefined) {
  const enabled = Platform.OS === 'web' && onRefresh !== undefined;
  const scrollTop = useRef(0);
  const startY = useRef<number | undefined>(undefined);
  const [pullDistance, setPullDistance] = useState(0);

  const fingerY = (event: GestureResponderEvent): number | undefined => event.nativeEvent.touches[0]?.pageY;

  const handlers = {
    scrollEventThrottle: 16,
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollTop.current = event.nativeEvent.contentOffset.y;
    },
    onTouchStart: (event: GestureResponderEvent) => {
      startY.current = scrollTop.current <= 0 ? fingerY(event) : undefined;
    },
    onTouchMove: (event: GestureResponderEvent) => {
      const y = fingerY(event);
      if (startY.current === undefined || y === undefined) return;
      setPullDistance(Math.min(MAX_PULL, Math.max(0, (y - startY.current) * RESISTANCE)));
    },
    onTouchEnd: () => {
      if (startY.current !== undefined && pullDistance >= THRESHOLD) onRefresh?.();
      startY.current = undefined;
      setPullDistance(0);
    },
  };

  return { enabled, pullDistance, handlers };
}
