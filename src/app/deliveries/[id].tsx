import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PriorityControl } from '../../components/PriorityControl';
import {
  getDeliveryProgress,
  getDeliveryStatusMeta,
} from '../../features/deliveries/deliveryHelpers';
import { useDelivery } from '../../features/deliveries/useDelivery';
import { COLORS } from '../../theme/colors';

export default function DeliveryDetailsScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const {
    delivery,
    loading,
    error,
    actionLoading,
    actionError,
    prioritySyncing,
    retry,
    advance,
    resolveIssue,
    togglePriority,
  } = useDelivery(id);

  if (loading) {
    return (
      <View style={styles.stateScreen}>
        <ActivityIndicator
          size="large"
          color={COLORS.cyan}
        />

        <Text style={styles.stateCode}>
          DELIVERY / SYNC
        </Text>

        <Text style={styles.stateTitle}>
          Loading operation.
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateScreen}>
        <Text style={styles.errorCode}>
          DELIVERY / ERROR
        </Text>

        <Text style={styles.stateTitle}>
          Operation unavailable.
        </Text>

        <Text style={styles.stateMessage}>
          {error}
        </Text>

        <Pressable
          onPress={retry}
          style={({ pressed }) => [
            styles.retryButton,
            pressed &&
              styles.retryButtonPressed,
          ]}
        >
          <Text style={styles.retryText}>
            RETRY CONNECTION
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={styles.stateScreen}>
        <Text style={styles.errorCode}>
          404 / DELIVERY
        </Text>

        <Text style={styles.stateTitle}>
          Delivery not found.
        </Text>
      </View>
    );
  }

  const status =
    getDeliveryStatusMeta(
      delivery.status,
    );

  const progress =
    getDeliveryProgress(delivery);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.eyebrow}>
        DELIVERY OPERATION
      </Text>

      <View style={styles.headingRow}>
        <View>
          <Text style={styles.order}>
            {delivery.orderCode}
          </Text>

          <Text style={styles.updated}>
            LAST UPDATE {delivery.updatedAt.toUpperCase()}
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

      <View style={styles.progressPanel}>
        <Text style={styles.panelLabel}>
          OPERATION PROGRESS
        </Text>

        <Text style={styles.progressValue}>
          {progress}%
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
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>
            CUSTOMER
          </Text>

          <Text style={styles.infoValue}>
            {delivery.customerName}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>
            PRIORITY
          </Text>

          <Text style={styles.infoValue}>
            {delivery.priority.toUpperCase()}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>
            DISTANCE
          </Text>

          <Text style={styles.infoValue}>
            {delivery.distanceKm.toFixed(1)} KM
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>
            PACKAGES
          </Text>

          <Text style={styles.infoValue}>
            {delivery.packages}
          </Text>
        </View>
      </View>

      <View style={styles.destinationPanel}>
        <Text style={styles.panelLabel}>
          DESTINATION
        </Text>

        <Text style={styles.destination}>
          {delivery.destination}
        </Text>
      </View>

      <View style={styles.courierPanel}>
        <Text style={styles.panelLabel}>
          ASSIGNED COURIER
        </Text>

        <Text style={styles.courierName}>
          {delivery.courier?.name ??
            'Unassigned'}
        </Text>

        {delivery.courier && (
          <Text style={styles.courierVehicle}>
            {delivery.courier.vehicle.toUpperCase()}
          </Text>
        )}
      </View>

      <PriorityControl
        priority={delivery.priority}
        syncing={prioritySyncing}
        onToggle={togglePriority}
      />

      <View style={styles.actionPanel}>
        <Text style={styles.panelLabel}>
          OPERATION CONTROL
        </Text>

        {actionError && (
          <Text style={styles.actionError}>
            {actionError}
          </Text>
        )}

        {delivery.status === 'issue' ? (
          <Pressable
            disabled={actionLoading}
            onPress={resolveIssue}
            style={({ pressed }) => [
              styles.actionButton,
              styles.resolveButton,
              (pressed || actionLoading) &&
                styles.actionButtonPressed,
            ]}
          >
            <Text style={styles.actionButtonText}>
              {actionLoading
                ? 'RESOLVING INCIDENT...'
                : 'RESOLVE INCIDENT'}
            </Text>
          </Pressable>
        ) : delivery.status ===
          'delivered' ? (
          <View style={styles.completedPanel}>
            <Text style={styles.completedText}>
              ✓ OPERATION COMPLETED
            </Text>
          </View>
        ) : (
          <Pressable
            disabled={actionLoading}
            onPress={advance}
            style={({ pressed }) => [
              styles.actionButton,
              (pressed || actionLoading) &&
                styles.actionButtonPressed,
            ]}
          >
            <Text style={styles.actionButtonText}>
              {actionLoading
                ? 'UPDATING OPERATION...'
                : 'ADVANCE OPERATION →'}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.timelineHeader}>
        <Text style={styles.timelineCode}>
          ROUTE STATUS / 03
        </Text>

        <Text style={styles.timelineTitle}>
          Timeline
        </Text>
      </View>

      <View style={styles.timeline}>
        {delivery.timeline.map(
          (event, index) => (
            <View
              key={event.id}
              style={styles.timelineItem}
            >
              <View style={styles.timelineRail}>
                <View
                  style={[
                    styles.timelineDot,
                    event.completed
                      ? styles.timelineDotCompleted
                      : styles.timelineDotPending,
                  ]}
                />

                {index <
                  delivery.timeline.length -
                    1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      event.completed &&
                        styles.timelineLineCompleted,
                    ]}
                  />
                )}
              </View>

              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineEvent,
                    !event.completed &&
                      styles.timelineEventPending,
                  ]}
                >
                  {event.title}
                </Text>

                <Text style={styles.timelineTime}>
                  {event.time}
                </Text>
              </View>
            </View>
          ),
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  stateScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: COLORS.background,
  },
  stateCode: {
    marginTop: 20,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: COLORS.cyan,
  },
  errorCode: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: COLORS.red,
  },
  stateTitle: {
    marginTop: 10,
    fontSize: 27,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  stateMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.cyan,
  },
  retryButtonPressed: {
    opacity: 0.6,
  },
  retryText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: COLORS.cyan,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: COLORS.cyan,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  order: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.2,
    color: COLORS.text,
  },
  updated: {
    marginTop: 5,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: COLORS.muted,
  },
  statusBadge: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  progressPanel: {
    marginTop: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  panelLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: COLORS.muted,
  },
  progressValue: {
    marginTop: 8,
    fontSize: 45,
    fontWeight: '900',
    color: COLORS.text,
  },
  progressTrack: {
    height: 5,
    marginTop: 14,
    backgroundColor: COLORS.surfaceRaised,
  },
  progressFill: {
    height: '100%',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  infoCard: {
    width: '48%',
    minHeight: 92,
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: COLORS.muted,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  destinationPanel: {
    marginTop: 8,
    padding: 18,
    backgroundColor: COLORS.cyan,
  },
  destination: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.background,
  },
  courierPanel: {
    marginTop: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  courierName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  courierVehicle: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    color: COLORS.cyan,
  },
  actionPanel: {
    marginTop: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  actionError: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.red,
  },
  actionButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.cyan,
  },
  resolveButton: {
    backgroundColor: COLORS.amber,
  },
  actionButtonPressed: {
    opacity: 0.55,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: COLORS.background,
  },
  completedPanel: {
    marginTop: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  completedText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    color: COLORS.green,
  },
  timelineHeader: {
    marginTop: 34,
    marginBottom: 20,
  },
  timelineCode: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: COLORS.cyan,
  },
  timelineTitle: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  timeline: {
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 70,
  },
  timelineRail: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  timelineDotCompleted: {
    backgroundColor: COLORS.cyan,
  },
  timelineDotPending: {
    borderWidth: 2,
    borderColor: COLORS.muted,
    backgroundColor: COLORS.surface,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 5,
    backgroundColor: COLORS.border,
  },
  timelineLineCompleted: {
    backgroundColor: COLORS.cyanSoft,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 10,
  },
  timelineEvent: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  timelineEventPending: {
    color: COLORS.muted,
  },
  timelineTime: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
  },
});
