import { MOCK_DELIVERIES } from '../features/deliveries/mockDeliveries';
import type {
  Delivery,
  DeliveryOverview,
  DeliveryPriority,
  DeliveryQuery,
  DeliveryStats,
  DeliveryStatus,
} from '../types/delivery';

export const DELIVERY_SERVICE_CONFIG = {
  simulateFailure: false,
  simulateMutationFailure: false,
};

const STATUS_FLOW: Partial<
  Record<DeliveryStatus, DeliveryStatus>
> = {
  pending: 'assigned',
  assigned: 'picked_up',
  picked_up: 'in_transit',
  in_transit: 'delivered',
};

const TIMELINE_TITLE_BY_STATUS: Partial<
  Record<DeliveryStatus, string>
> = {
  assigned: 'Courier assigned',
  picked_up: 'Package picked up',
  in_transit: 'In transit',
  delivered: 'Delivered',
};

function cloneDelivery(
  delivery: Delivery,
): Delivery {
  return {
    ...delivery,
    courier: delivery.courier
      ? { ...delivery.courier }
      : null,
    timeline: delivery.timeline.map(
      (event) => ({ ...event }),
    ),
  };
}

let deliveryStore =
  MOCK_DELIVERIES.map(cloneDelivery);

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function simulateNetwork(
  mode: 'read' | 'mutation' = 'read',
) {
  await wait(650);

  if (
    mode === 'mutation' &&
    DELIVERY_SERVICE_CONFIG.simulateMutationFailure
  ) {
    throw new Error(
      'Delivery mutation unavailable.',
    );
  }

  if (
    DELIVERY_SERVICE_CONFIG.simulateFailure
  ) {
    throw new Error(
      'Delivery service unavailable.',
    );
  }
}

function getCurrentTime() {
  return new Date().toLocaleTimeString(
    [],
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  );
}

function findDeliveryIndex(
  deliveryId: string,
) {
  return deliveryStore.findIndex(
    (delivery) =>
      delivery.id === deliveryId,
  );
}

function getDeliveryStats(): DeliveryStats {
  return {
    total: deliveryStore.length,

    active: deliveryStore.filter(
      (delivery) =>
        delivery.status !== 'delivered' &&
        delivery.status !== 'issue',
    ).length,

    delivered: deliveryStore.filter(
      (delivery) =>
        delivery.status === 'delivered',
    ).length,

    issues: deliveryStore.filter(
      (delivery) =>
        delivery.status === 'issue',
    ).length,
  };
}

function matchesFilter(
  delivery: Delivery,
  query: DeliveryQuery,
) {
  switch (query.filter) {
    case 'active':
      return (
        delivery.status !== 'delivered' &&
        delivery.status !== 'issue'
      );

    case 'issues':
      return delivery.status === 'issue';

    case 'delivered':
      return delivery.status === 'delivered';

    case 'all':
      return true;
  }
}

function matchesSearch(
  delivery: Delivery,
  search: string,
) {
  const normalizedSearch =
    search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  const searchableValues = [
    delivery.orderCode,
    delivery.customerName,
    delivery.destination,
    delivery.courier?.name ?? '',
    delivery.courier?.vehicle ?? '',
  ];

  return searchableValues.some(
    (value) =>
      value
        .toLowerCase()
        .includes(normalizedSearch),
  );
}

export async function getDeliveryOverview(
  query: DeliveryQuery = {
    filter: 'all',
    search: '',
  },
): Promise<DeliveryOverview> {
  await simulateNetwork();

  const deliveries =
    deliveryStore
      .filter((delivery) =>
        matchesFilter(
          delivery,
          query,
        ),
      )
      .filter((delivery) =>
        matchesSearch(
          delivery,
          query.search,
        ),
      )
      .map(cloneDelivery);

  return {
    deliveries,
    stats: getDeliveryStats(),
  };
}

export async function getDeliveryById(
  deliveryId: string,
): Promise<Delivery | null> {
  await simulateNetwork();

  const delivery =
    deliveryStore.find(
      (item) => item.id === deliveryId,
    );

  return delivery
    ? cloneDelivery(delivery)
    : null;
}

export async function updateDeliveryPriority(
  deliveryId: string,
  priority: DeliveryPriority,
): Promise<Delivery> {
  await simulateNetwork('mutation');

  const index =
    findDeliveryIndex(deliveryId);

  if (index === -1) {
    throw new Error(
      'Delivery not found.',
    );
  }

  const updatedDelivery: Delivery = {
    ...deliveryStore[index],
    priority,
    updatedAt: 'just now',
  };

  deliveryStore[index] =
    updatedDelivery;

  return cloneDelivery(
    updatedDelivery,
  );
}

export async function advanceDeliveryStatus(
  deliveryId: string,
): Promise<Delivery> {
  await simulateNetwork('mutation');

  const index =
    findDeliveryIndex(deliveryId);

  if (index === -1) {
    throw new Error(
      'Delivery not found.',
    );
  }

  const currentDelivery =
    deliveryStore[index];

  if (
    currentDelivery.status === 'issue'
  ) {
    throw new Error(
      'Resolve the delivery issue before advancing.',
    );
  }

  if (
    currentDelivery.status === 'delivered'
  ) {
    return cloneDelivery(
      currentDelivery,
    );
  }

  const nextStatus =
    STATUS_FLOW[
      currentDelivery.status
    ];

  if (!nextStatus) {
    throw new Error(
      'Delivery cannot advance.',
    );
  }

  const timelineTitle =
    TIMELINE_TITLE_BY_STATUS[
      nextStatus
    ];

  const updatedDelivery: Delivery = {
    ...currentDelivery,
    status: nextStatus,
    etaMinutes:
      nextStatus === 'delivered'
        ? 0
        : Math.max(
            5,
            currentDelivery.etaMinutes -
              8,
          ),
    updatedAt: 'just now',
    timeline:
      currentDelivery.timeline.map(
        (event) => {
          if (
            event.title !==
            timelineTitle
          ) {
            return { ...event };
          }

          return {
            ...event,
            completed: true,
            time:
              event.time === '--:--'
                ? getCurrentTime()
                : event.time,
          };
        },
      ),
  };

  deliveryStore[index] =
    updatedDelivery;

  return cloneDelivery(
    updatedDelivery,
  );
}

export async function resolveDeliveryIssue(
  deliveryId: string,
): Promise<Delivery> {
  await simulateNetwork('mutation');

  const index =
    findDeliveryIndex(deliveryId);

  if (index === -1) {
    throw new Error(
      'Delivery not found.',
    );
  }

  const currentDelivery =
    deliveryStore[index];

  if (
    currentDelivery.status !== 'issue'
  ) {
    return cloneDelivery(
      currentDelivery,
    );
  }

  const updatedDelivery: Delivery = {
    ...currentDelivery,
    status: 'in_transit',
    etaMinutes: 22,
    updatedAt: 'just now',
    timeline: [
      ...currentDelivery.timeline.map(
        (event) => ({ ...event }),
      ),
      {
        id: `event-${Date.now()}`,
        title: 'Issue resolved',
        time: getCurrentTime(),
        completed: true,
      },
    ],
  };

  deliveryStore[index] =
    updatedDelivery;

  return cloneDelivery(
    updatedDelivery,
  );
}
