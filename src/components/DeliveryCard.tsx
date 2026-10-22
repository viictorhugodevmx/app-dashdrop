import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getDeliveryProgress,
  getDeliveryStatusMeta,
} from '../features/deliveries/deliveryHelpers';
import { COLORS } from '../theme/colors';
import type { Delivery } from '../types/delivery';

type DeliveryCardProps = {
  delivery: Delivery;
  onPress: (deliveryId: string) => void;
};

export function DeliveryCard({
  delivery,
  onPress,
}: DeliveryCardProps) {
  const status =
    getDeliveryStatusMeta(delivery.status);

  const progress =
    getDeliveryProgress(delivery);

  return (
    <Pressable
      onPress={() => onPress(delivery.id)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.orderCode}>
            {delivery.orderCode}
          </Text>

          <Text style={styles.updated}>
            UPDATED {delivery.updatedAt.toUpperCase()}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                status.backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: status.color,
              },
            ]}
          >
            {status.label}
          </Text>
        </View>
      </View>

      <Text style={styles.customer}>
        {delivery.customerName}
      </Text>

      <Text style={styles.destination}>
        {delivery.destination}
      </Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor:
                delivery.status === 'issue'
                  ? COLORS.red
                  : COLORS.cyan,
            },
          ]}
        />
      </View>

      <View style={styles.metrics}>
        <View>
          <Text style={styles.metricLabel}>
            PROGRESS
          </Text>

          <Text style={styles.metricValue}>
            {progress}%
          </Text>
        </View>

        <View>
          <Text style={styles.metricLabel}>
            DISTANCE
          </Text>

          <Text style={styles.metricValue}>
            {delivery.distanceKm.toFixed(1)} KM
          </Text>
        </View>

        <View>
          <Text style={styles.metricLabel}>
            ETA
          </Text>

          <Text style={styles.metricValue}>
            {delivery.status === 'delivered'
              ? 'DONE'
              : delivery.status === 'issue'
                ? 'HOLD'
                : `${delivery.etaMinutes} MIN`}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.courier}>
          {delivery.courier
            ? `${delivery.courier.name} / ${delivery.courier.vehicle}`
            : 'NO COURIER ASSIGNED'}
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  cardPressed: {
    opacity: 0.7,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderCode: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.text,
  },
  updated: {
    marginTop: 4,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.muted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  customer: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  destination: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
  },
  progressTrack: {
    height: 4,
    marginTop: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceRaised,
  },
  progressFill: {
    height: '100%',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
    color: COLORS.muted,
  },
  metricValue: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  courier: {
    flex: 1,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: COLORS.cyan,
  },
  arrow: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.text,
  },
});
