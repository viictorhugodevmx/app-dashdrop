import {
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  router,
  useFocusEffect,
} from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeliveryCard } from '../components/DeliveryCard';
import { DeliveryFilters } from '../components/DeliveryFilters';
import { useDeliveries } from '../features/deliveries/useDeliveries';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { COLORS } from '../theme/colors';
import type { DeliveryFilter } from '../types/delivery';

export default function HomeScreen() {
  const [
    filter,
    setFilter,
  ] =
    useState<DeliveryFilter>('all');

  const [
    search,
    setSearch,
  ] = useState('');

  const debouncedSearch =
    useDebouncedValue(
      search,
      350,
    );

  const {
    deliveries,
    stats,
    loading,
    refreshing,
    querying,
    error,
    retry,
    refresh,
  } = useDeliveries(
    filter,
    debouncedSearch,
  );

  const firstFocusRef =
    useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (
        firstFocusRef.current
      ) {
        firstFocusRef.current =
          false;
        return;
      }

      refresh();
    }, [refresh]),
  );

  const activeDeliveries = stats.active;
  const deliveredDeliveries = stats.delivered;
  const issues = stats.issues;

  function openDelivery(
    deliveryId: string,
  ) {
    router.push({
      pathname:
        '/deliveries/[id]',
      params: {
        id: deliveryId,
      },
    });
  }

  if (loading) {
    return (
      <SafeAreaView
        style={styles.stateScreen}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={
            COLORS.background
          }
        />

        <ActivityIndicator
          size="large"
          color={COLORS.cyan}
        />

        <Text style={styles.stateCode}>
          NETWORK / SYNC
        </Text>

        <Text
          style={styles.stateTitle}
        >
          Loading operations.
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={styles.stateScreen}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={
            COLORS.background
          }
        />

        <Text
          style={styles.errorCode}
        >
          NETWORK / ERROR
        </Text>

        <Text
          style={styles.stateTitle}
        >
          Control center offline.
        </Text>

        <Text
          style={styles.stateMessage}
        >
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
          <Text
            style={styles.retryText}
          >
            RETRY CONNECTION
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.background
        }
      />

      <FlatList
        data={deliveries}
        keyExtractor={(delivery) =>
          delivery.id
        }
        renderItem={({ item }) => (
          <DeliveryCard
            delivery={item}
            onPress={
              openDelivery
            }
          />
        )}
        ItemSeparatorComponent={() => (
          <View
            style={
              styles.separator
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.cyan}
            colors={[COLORS.cyan]}
          />
        }
        ListHeaderComponent={
          <View>
            <View
              style={
                styles.systemRow
              }
            >
              <View
                style={styles.brand}
              >
                <View
                  style={
                    styles.brandMark
                  }
                >
                  <Text
                    style={
                      styles.brandMarkText
                    }
                  >
                    DD
                  </Text>
                </View>

                <View>
                  <Text
                    style={
                      styles.brandName
                    }
                  >
                    DASHDROP
                  </Text>

                  <Text
                    style={
                      styles.brandCode
                    }
                  >
                    OPS CONTROL / 01
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.liveBadge
                }
              >
                <View
                  style={
                    styles.liveDot
                  }
                />

                <Text
                  style={
                    styles.liveText
                  }
                >
                  LIVE
                </Text>
              </View>
            </View>

            <View
              style={styles.intro}
            >
              <Text
                style={
                  styles.eyebrow
                }
              >
                DELIVERY OPERATIONS
              </Text>

              <Text
                style={
                  styles.headline
                }
              >
                Control
                {'\n'}
                center.
              </Text>

              <Text
                style={
                  styles.description
                }
              >
                Real-time operational overview of the delivery network.
              </Text>
            </View>

            <View
              style={styles.stats}
            >
              <View
                style={
                  styles.primaryStat
                }
              >
                <Text
                  style={
                    styles.primaryStatLabel
                  }
                >
                  ACTIVE
                </Text>

                <Text
                  style={
                    styles.primaryStatValue
                  }
                >
                  {String(
                    activeDeliveries,
                  ).padStart(
                    2,
                    '0',
                  )}
                </Text>
              </View>

              <View
                style={styles.stat}
              >
                <Text
                  style={
                    styles.statLabel
                  }
                >
                  DELIVERED
                </Text>

                <Text
                  style={
                    styles.statValue
                  }
                >
                  {String(
                    deliveredDeliveries,
                  ).padStart(
                    2,
                    '0',
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.stat,
                  issues > 0 &&
                    styles.issueStat,
                ]}
              >
                <Text
                  style={
                    styles.statLabel
                  }
                >
                  ISSUES
                </Text>

                <Text
                  style={[
                    styles.statValue,
                    issues > 0 &&
                      styles.issueValue,
                  ]}
                >
                  {String(
                    issues,
                  ).padStart(
                    2,
                    '0',
                  )}
                </Text>
              </View>
            </View>

            <DeliveryFilters
              filter={filter}
              search={search}
              onFilterChange={
                setFilter
              }
              onSearchChange={
                setSearch
              }
            />

            <View
              style={
                styles.sectionHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.sectionCode
                  }
                >
                  NETWORK / 04
                </Text>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Deliveries
                </Text>
              </View>

              {querying ? (
                <ActivityIndicator
                  color={
                    COLORS.cyan
                  }
                />
              ) : (
                <Text
                  style={
                    styles.sectionCount
                  }
                >
                  {
                    deliveries.length
                  }
                </Text>
              )}
            </View>

            {querying && (
              <Text
                style={
                  styles.queryingText
                }
              >
                FILTERING NETWORK...
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View
            style={styles.emptyState}
          >
            <Text
              style={styles.emptyCode}
            >
              00 / RESULTS
            </Text>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No operations found.
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Change the filter or search query.
            </Text>
          </View>
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },
    stateScreen: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      padding: 28,
      backgroundColor:
        COLORS.background,
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
      borderColor:
        COLORS.cyan,
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
    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 40,
      flexGrow: 1,
    },
    systemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    brandMark: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.cyan,
    },
    brandMarkText: {
      fontSize: 14,
      fontWeight: '900',
      color:
        COLORS.background,
    },
    brandName: {
      marginLeft: 11,
      fontSize: 17,
      fontWeight: '900',
      color: COLORS.text,
    },
    brandCode: {
      marginTop: 2,
      marginLeft: 11,
      fontSize: 8,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: COLORS.muted,
    },
    liveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderWidth: 1,
      borderColor:
        COLORS.border,
    },
    liveDot: {
      width: 7,
      height: 7,
      marginRight: 7,
      borderRadius: 4,
      backgroundColor:
        COLORS.green,
    },
    liveText: {
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1,
      color: COLORS.green,
    },
    intro: {
      marginTop: 40,
    },
    eyebrow: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1.8,
      color: COLORS.cyan,
    },
    headline: {
      marginTop: 12,
      fontSize: 50,
      lineHeight: 52,
      fontWeight: '900',
      letterSpacing: -2,
      color: COLORS.text,
    },
    description: {
      maxWidth: 310,
      marginTop: 15,
      fontSize: 14,
      lineHeight: 21,
      color: COLORS.muted,
    },
    stats: {
      flexDirection: 'row',
      marginTop: 30,
    },
    primaryStat: {
      flex: 1,
      padding: 16,
      backgroundColor:
        COLORS.cyan,
    },
    primaryStatLabel: {
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
      color:
        COLORS.background,
    },
    primaryStatValue: {
      marginTop: 6,
      fontSize: 31,
      fontWeight: '900',
      color:
        COLORS.background,
    },
    stat: {
      flex: 1,
      marginLeft: 8,
      padding: 16,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      backgroundColor:
        COLORS.surface,
    },
    issueStat: {
      borderColor: COLORS.red,
    },
    statLabel: {
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
      color: COLORS.muted,
    },
    statValue: {
      marginTop: 6,
      fontSize: 31,
      fontWeight: '900',
      color: COLORS.text,
    },
    issueValue: {
      color: COLORS.red,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent:
        'space-between',
      marginTop: 30,
      marginBottom: 18,
    },
    sectionCode: {
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.2,
      color: COLORS.cyan,
    },
    sectionTitle: {
      marginTop: 6,
      fontSize: 27,
      fontWeight: '900',
      color: COLORS.text,
    },
    sectionCount: {
      fontSize: 28,
      fontWeight: '900',
      color: COLORS.muted,
    },
    queryingText: {
      marginTop: -8,
      marginBottom: 14,
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
      color: COLORS.cyan,
    },
    separator: {
      height: 10,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 46,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      backgroundColor:
        COLORS.surface,
    },
    emptyCode: {
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.3,
      color: COLORS.cyan,
    },
    emptyTitle: {
      marginTop: 10,
      fontSize: 22,
      fontWeight: '900',
      color: COLORS.text,
    },
    emptyText: {
      marginTop: 6,
      fontSize: 13,
      color: COLORS.muted,
      textAlign: 'center',
    },
  });
