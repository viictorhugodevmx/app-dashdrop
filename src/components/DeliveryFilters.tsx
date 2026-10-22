import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS } from '../theme/colors';
import type { DeliveryFilter } from '../types/delivery';

type DeliveryFiltersProps = {
  filter: DeliveryFilter;
  search: string;
  onFilterChange: (
    filter: DeliveryFilter,
  ) => void;
  onSearchChange: (
    value: string,
  ) => void;
};

const FILTERS: {
  value: DeliveryFilter;
  label: string;
}[] = [
  {
    value: 'all',
    label: 'ALL',
  },
  {
    value: 'active',
    label: 'ACTIVE',
  },
  {
    value: 'issues',
    label: 'ISSUES',
  },
  {
    value: 'delivered',
    label: 'DONE',
  },
];

export function DeliveryFilters({
  filter,
  search,
  onFilterChange,
  onSearchChange,
}: DeliveryFiltersProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        NETWORK QUERY / 03
      </Text>

      <TextInput
        value={search}
        onChangeText={onSearchChange}
        placeholder="Order, customer, zone, courier..."
        placeholderTextColor={
          COLORS.muted
        }
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <View style={styles.filters}>
        {FILTERS.map((item) => {
          const selected =
            filter === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() =>
                onFilterChange(
                  item.value,
                )
              }
              style={({ pressed }) => [
                styles.filterButton,
                selected &&
                  styles.filterButtonSelected,
                pressed &&
                  styles.filterButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected &&
                    styles.filterTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  label: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: COLORS.cyan,
  },
  input: {
    height: 48,
    marginTop: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor:
      COLORS.background,
    fontSize: 13,
    color: COLORS.text,
  },
  filters: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonSelected: {
    borderColor: COLORS.cyan,
    backgroundColor:
      COLORS.cyanSoft,
  },
  filterButtonPressed: {
    opacity: 0.6,
  },
  filterText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
    color: COLORS.muted,
  },
  filterTextSelected: {
    color: COLORS.cyan,
  },
});
