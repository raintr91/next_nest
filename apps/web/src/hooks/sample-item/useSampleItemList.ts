'use client';

import { useCallback, useMemo, useState } from 'react';
import type { DataTableColumn } from '@/components/molecules/data-table-types';
import { createSampleItemService } from '@/services/sample-item.service';
import { sampleItemMockSearch } from '@/mocks/sample-item.mock';

/**
 * Contract gen pilot — list hook (portal-gen).
 * Mock boundary: replace sampleItemMockSearch with service.search on /wire.
 */
export function useSampleItemList() {
  const service = useMemo(() => createSampleItemService(), []);

  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [query, setQuery] = useState<Record<string, unknown>>({ per_page: 10 });

  const filters = useMemo(
    () => [
    ],
    [],
  );

  const columns = useMemo<DataTableColumn[]>(
    () => [
      {
        key: 'name',
        title: ''
      },
      {
        key: 'managers',
        title: ''
      }
    ],
    [],
  );

  const searchKeys = useMemo(() => columns.map((column) => column.key), [columns]);


  const load = useCallback(async () => {
    setPending(true);
    setErrorMsg(null);
    try {
      const result = await sampleItemMockSearch(query);
      setItems(result.items);
      setTotal(result.total ?? result.items.length);
    } catch (error: unknown) {
      setErrorMsg((error as Error)?.message ?? 'Cannot load Contract gen pilot');
      setItems([]);
      setTotal(null);
    } finally {
      setPending(false);
    }
  }, [query]);

  const onSearch = useCallback(() => load(), [load]);

  const onReset = useCallback(async () => {
    const nextQuery = { per_page: 10 };
    setQuery(nextQuery);
    setPending(true);
    setErrorMsg(null);
    try {
      const result = await sampleItemMockSearch(nextQuery);
      setItems(result.items);
      setTotal(result.total ?? result.items.length);
    } catch (error: unknown) {
      setErrorMsg((error as Error)?.message ?? 'Cannot load Contract gen pilot');
      setItems([]);
      setTotal(null);
    } finally {
      setPending(false);
    }
  }, []);



  return {
    pending,
    errorMsg,
    items,
    total,
    query,
    setQuery,
    filters,
    columns,
    searchKeys,
    load,
    onSearch,
    onReset,
    service
  };
}
