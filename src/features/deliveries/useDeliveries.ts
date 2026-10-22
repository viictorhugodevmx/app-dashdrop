import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getDeliveryOverview } from '../../services/deliveryService';
import type {
  Delivery,
  DeliveryFilter,
  DeliveryStats,
} from '../../types/delivery';

type LoadMode =
  | 'initial'
  | 'refresh'
  | 'query';

const EMPTY_STATS: DeliveryStats = {
  total: 0,
  active: 0,
  delivered: 0,
  issues: 0,
};

export function useDeliveries(
  filter: DeliveryFilter,
  search: string,
) {
  const [deliveries, setDeliveries] =
    useState<Delivery[]>([]);

  const [stats, setStats] =
    useState<DeliveryStats>(
      EMPTY_STATS,
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [querying, setQuerying] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const initializedRef =
    useRef(false);

  const requestIdRef =
    useRef(0);

  const loadDeliveries = useCallback(
    async (
      mode: LoadMode = 'initial',
    ) => {
      const requestId =
        ++requestIdRef.current;

      if (mode === 'initial') {
        setLoading(true);
      }

      if (mode === 'refresh') {
        setRefreshing(true);
      }

      if (mode === 'query') {
        setQuerying(true);
      }

      setError(null);

      try {
        const overview =
          await getDeliveryOverview({
            filter,
            search,
          });

        if (
          requestId !==
          requestIdRef.current
        ) {
          return;
        }

        setDeliveries(
          overview.deliveries,
        );

        setStats(
          overview.stats,
        );
      } catch (loadError) {
        if (
          requestId !==
          requestIdRef.current
        ) {
          return;
        }

        console.error(
          'Failed to load deliveries:',
          loadError,
        );

        setError(
          'Operations data could not be loaded.',
        );
      } finally {
        if (
          requestId ===
          requestIdRef.current
        ) {
          setLoading(false);
          setRefreshing(false);
          setQuerying(false);
        }
      }
    },
    [
      filter,
      search,
    ],
  );

  useEffect(() => {
    const mode: LoadMode =
      initializedRef.current
        ? 'query'
        : 'initial';

    initializedRef.current = true;

    void loadDeliveries(mode);
  }, [loadDeliveries]);

  const retry = useCallback(() => {
    void loadDeliveries('initial');
  }, [loadDeliveries]);

  const refresh = useCallback(() => {
    void loadDeliveries('refresh');
  }, [loadDeliveries]);

  return {
    deliveries,
    stats,
    loading,
    refreshing,
    querying,
    error,
    retry,
    refresh,
  };
}
