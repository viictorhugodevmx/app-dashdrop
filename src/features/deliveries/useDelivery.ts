import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  advanceDeliveryStatus,
  getDeliveryById,
  resolveDeliveryIssue,
  updateDeliveryPriority,
} from '../../services/deliveryService';
import type { Delivery } from '../../types/delivery';

export function useDelivery(
  deliveryId: string | undefined,
) {
  const [delivery, setDelivery] =
    useState<Delivery | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    actionError,
    setActionError,
  ] = useState<string | null>(
    null,
  );

  const [
    prioritySyncing,
    setPrioritySyncing,
  ] = useState(false);

  const loadDelivery = useCallback(
    async () => {
      if (!deliveryId) {
        setDelivery(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data =
          await getDeliveryById(
            deliveryId,
          );

        setDelivery(data);
      } catch (loadError) {
        console.error(
          'Failed to load delivery:',
          loadError,
        );

        setError(
          'Delivery details could not be loaded.',
        );
      } finally {
        setLoading(false);
      }
    },
    [deliveryId],
  );

  useEffect(() => {
    void loadDelivery();
  }, [loadDelivery]);

  const advance = useCallback(
    async () => {
      if (!deliveryId) {
        return;
      }

      setActionLoading(true);
      setActionError(null);

      try {
        const updatedDelivery =
          await advanceDeliveryStatus(
            deliveryId,
          );

        setDelivery(
          updatedDelivery,
        );
      } catch (actionFailure) {
        console.error(
          'Failed to advance delivery:',
          actionFailure,
        );

        setActionError(
          'Operation could not be updated.',
        );
      } finally {
        setActionLoading(false);
      }
    },
    [deliveryId],
  );

  const resolveIssue = useCallback(
    async () => {
      if (!deliveryId) {
        return;
      }

      setActionLoading(true);
      setActionError(null);

      try {
        const updatedDelivery =
          await resolveDeliveryIssue(
            deliveryId,
          );

        setDelivery(
          updatedDelivery,
        );
      } catch (actionFailure) {
        console.error(
          'Failed to resolve delivery issue:',
          actionFailure,
        );

        setActionError(
          'Incident could not be resolved.',
        );
      } finally {
        setActionLoading(false);
      }
    },
    [deliveryId],
  );

  const togglePriority = useCallback(
    async () => {
      if (
        !deliveryId ||
        !delivery ||
        prioritySyncing
      ) {
        return;
      }

      const previousDelivery =
        delivery;

      const nextPriority =
        delivery.priority === 'express'
          ? 'standard'
          : 'express';

      setActionError(null);
      setPrioritySyncing(true);

      setDelivery({
        ...delivery,
        priority: nextPriority,
        updatedAt: 'syncing...',
      });

      try {
        const updatedDelivery =
          await updateDeliveryPriority(
            deliveryId,
            nextPriority,
          );

        setDelivery(
          updatedDelivery,
        );
      } catch (priorityFailure) {
        console.error(
          'Failed to update priority:',
          priorityFailure,
        );

        setDelivery(
          previousDelivery,
        );

        setActionError(
          'Priority sync failed. Previous value restored.',
        );
      } finally {
        setPrioritySyncing(false);
      }
    },
    [
      delivery,
      deliveryId,
      prioritySyncing,
    ],
  );

  return {
    delivery,
    loading,
    error,
    actionLoading,
    actionError,
    prioritySyncing,

    retry() {
      void loadDelivery();
    },

    advance() {
      void advance();
    },

    resolveIssue() {
      void resolveIssue();
    },

    togglePriority() {
      void togglePriority();
    },
  };
}
