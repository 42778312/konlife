import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { List, Map } from 'lucide-react-native';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { colors, fonts, radius } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { MapWidget } from '@/components/events/MapWidget';
import { SearchInput } from '@/components/ui/SearchInput';

const FILTERS = ['Date ⌵', 'Category ⌵', 'Music ⌵', 'Price ⌵', 'Distance ⌵'];

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const discoverEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MOCK_EVENTS.slice(0, 6).filter((event) => {
      if (!q) return true;
      return (
        event.title.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.tags.some((t) => t.toLowerCase().includes(q)) ||
        event.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const header = (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
      <Text style={styles.title}>Discover</Text>
      <View style={styles.toggle}>
        <Pressable
          onPress={() => {
            selectionTick();
            setActiveView('list');
          }}
          style={[styles.toggleBtn, activeView === 'list' && styles.toggleActive]}
          accessibilityLabel="List view"
        >
          <List size={16} color={activeView === 'list' ? colors.black : colors.zinc400} strokeWidth={2.2} />
        </Pressable>
        <Pressable
          onPress={() => {
            selectionTick();
            setActiveView('map');
          }}
          style={[styles.toggleBtn, activeView === 'map' && styles.toggleActive]}
          accessibilityLabel="Map view"
        >
          <Map size={16} color={activeView === 'map' ? colors.black : colors.zinc400} strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <Screen header={header} onRefresh={onRefresh} refreshing={refreshing} keyboard>
      <View style={styles.stack}>
        <SearchInput value={searchQuery} onChangeText={setSearchQuery} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          decelerationRate="fast"
          keyboardShouldPersistTaps="handled"
        >
          {FILTERS.map((chip) => {
            const on = activeFilters.includes(chip);
            return (
              <Pressable
                key={chip}
                onPress={() => {
                  selectionTick();
                  setActiveFilters((prev) =>
                    prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
                  );
                }}
                style={[styles.chip, on && styles.chipOn]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{chip}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {activeView === 'list' ? (
          <View style={styles.list}>
            {discoverEvents.length === 0 ? (
              <Text style={styles.empty}>No events match “{searchQuery}”</Text>
            ) : (
              discoverEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="list" instanceId="mobile-discover" />
              ))
            )}
          </View>
        ) : (
          <MapWidget venueName="Blechnerei" cityName="Konstanz" interactive />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.zinc900,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.white,
    letterSpacing: 1,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: radius['2xl'],
    padding: 4,
  },
  toggleBtn: {
    width: 40,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  toggleActive: {
    backgroundColor: colors.neon,
  },
  stack: {
    gap: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
    justifyContent: 'center',
    cursor: 'pointer',
  },
  chipOn: {
    backgroundColor: colors.neon,
    borderColor: colors.neon,
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.zinc300,
  },
  chipTextOn: {
    color: colors.black,
  },
  list: {
    gap: 12,
  },
  empty: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.zinc400,
    textAlign: 'center',
    paddingVertical: 32,
  },
});
