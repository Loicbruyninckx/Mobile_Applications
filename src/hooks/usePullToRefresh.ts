import { useRef, useState } from 'react';
import { Platform, type GestureResponderEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

/** Zo ver (in px) moet je trekken voor er herladen wordt. */
const THRESHOLD = 70;
/** Verder dan dit schuift de inhoud niet mee. */
const MAX_PULL = 100;
/** Je vinger beweegt 2× zo ver als de inhoud: dat voelt als "trekken". */
const RESISTANCE = 0.5;

/**
 * Pull-to-refresh voor de PWA. Op native doet RefreshControl dit, maar in de browser
 * (react-native-web) doet RefreshControl niets. Deze hook volgt daarom zelf je vinger:
 * sta je bovenaan en trek je naar beneden, dan groeit `pullDistance`; laat je los
 * voorbij THRESHOLD, dan wordt onRefresh aangeroepen.
 */
export function usePullToRefresh(onRefresh: (() => void) | undefined) {
  const enabled = Platform.OS === 'web' && onRefresh !== undefined;
  const scrollTop = useRef(0);
  /** Waar je vinger begon; undefined = er wordt niet getrokken. */
  const startY = useRef<number | undefined>(undefined);
  const [pullDistance, setPullDistance] = useState(0);

  const fingerY = (event: GestureResponderEvent): number | undefined => event.nativeEvent.touches[0]?.pageY;

  const handlers = {
    scrollEventThrottle: 16,
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollTop.current = event.nativeEvent.contentOffset.y;
    },
    onTouchStart: (event: GestureResponderEvent) => {
      // Alleen trekken als je helemaal bovenaan staat, anders scroll je gewoon.
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
