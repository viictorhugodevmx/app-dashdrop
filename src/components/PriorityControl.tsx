import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../theme/colors';
import type { DeliveryPriority } from '../types/delivery';

type PriorityControlProps = {
  priority: DeliveryPriority;
  syncing: boolean;
  onToggle: () => void;
};

export function PriorityControl({
  priority,
  syncing,
  onToggle,
}: PriorityControlProps) {
  const express =
    priority === 'express';

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>
          SERVICE PRIORITY
        </Text>

        <Text
          style={[
            styles.value,
            express &&
              styles.valueExpress,
          ]}
        >
          {priority.toUpperCase()}
        </Text>
      </View>

      <Pressable
        disabled={syncing}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.button,
          express &&
            styles.buttonExpress,
          (pressed || syncing) &&
            styles.buttonPressed,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            express &&
              styles.buttonTextExpress,
          ]}
        >
          {syncing
            ? 'SYNCING...'
            : express
              ? 'SET STANDARD'
              : 'SET EXPRESS'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginTop: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor:
      COLORS.surface,
  },
  label: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: COLORS.muted,
  },
  value: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.text,
  },
  valueExpress: {
    color: COLORS.amber,
  },
  button: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.cyan,
  },
  buttonExpress: {
    borderColor: COLORS.amber,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: COLORS.cyan,
  },
  buttonTextExpress: {
    color: COLORS.amber,
  },
});
