import { COLORS } from '../../theme/colors';
import type {
  Delivery,
  DeliveryStatus,
} from '../../types/delivery';

type DeliveryStatusMeta = {
  label: string;
  color: string;
  backgroundColor: string;
};

export function getDeliveryStatusMeta(
  status: DeliveryStatus,
): DeliveryStatusMeta {
  switch (status) {
    case 'pending':
      return {
        label: 'PENDING',
        color: COLORS.muted,
        backgroundColor: COLORS.surfaceRaised,
      };

    case 'assigned':
      return {
        label: 'ASSIGNED',
        color: COLORS.cyan,
        backgroundColor: COLORS.cyanSoft,
      };

    case 'picked_up':
      return {
        label: 'PICKED UP',
        color: COLORS.amber,
        backgroundColor: '#3B301D',
      };

    case 'in_transit':
      return {
        label: 'IN TRANSIT',
        color: COLORS.cyan,
        backgroundColor: COLORS.cyanSoft,
      };

    case 'delivered':
      return {
        label: 'DELIVERED',
        color: COLORS.green,
        backgroundColor: '#143629',
      };

    case 'issue':
      return {
        label: 'ISSUE',
        color: COLORS.red,
        backgroundColor: '#3A1D25',
      };
  }
}

export function getDeliveryProgress(
  delivery: Delivery,
): number {
  if (delivery.timeline.length === 0) {
    return 0;
  }

  const completedEvents =
    delivery.timeline.filter(
      (event) => event.completed,
    ).length;

  return Math.round(
    (completedEvents /
      delivery.timeline.length) *
      100,
  );
}
