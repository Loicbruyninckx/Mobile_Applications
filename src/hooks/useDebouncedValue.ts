import { useEffect, useState } from 'react';

/**
 * Geeft `value` pas door als die `delayMs` lang niet veranderd is.
 * Zo zoeken we niet bij elke toetsaanslag, maar pas als je even stopt met typen.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
