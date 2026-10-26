import { useEffect, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

interface SearchState<T> {
  results: T[];
  isSearching: boolean;
  error?: string;
}

/**
 * Zoekt met `search` zodra je even stopt met typen (vanaf 2 tekens).
 * Een trager, ouder antwoord overschrijft nooit een nieuwer antwoord.
 * De zoekfunctie zelf komt uit een service (src/services/).
 */
export function useSearch<T>(query: string, search: (term: string) => Promise<T[]>): SearchState<T> {
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const [state, setState] = useState<SearchState<T>>({ results: [], isSearching: false });

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setState({ results: [], isSearching: false });
      return;
    }

    let isCurrent = true;
    setState((previous) => ({ results: previous.results, isSearching: true }));
    search(debouncedQuery)
      .then((results) => {
        if (isCurrent) setState({ results, isSearching: false });
      })
      .catch((e: unknown) => {
        if (isCurrent) {
          setState({
            results: [],
            isSearching: false,
            error: e instanceof Error ? e.message : 'Zoeken mislukt.',
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery, search]);

  return state;
}
