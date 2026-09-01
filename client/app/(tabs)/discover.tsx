import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { List, Map, Search, WifiOff } from 'lucide-react-native';
import { type DayKey } from '@/data/mockEvents';
import { groupEventsByDate, matchesDayChip } from '@/lib/partyInsider/dates';
import { matchesVenueFilter, type PriceFilter } from '@/lib/exploreFilters';
import { colors, layout, MIN_TOUCH, radius, space, type, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { useEvents } from '@/context/EventsProvider';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { MapWidget } from '@/components/events/MapWidget';
import { useEventExpand } from '@/context/EventExpandContext';
import { SearchInput } from '@/components/ui/SearchInput';
import { ExploreFilters } from '@/components/events/ExploreFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ExploreScreen() {
  const { events, loading, error, refresh } = useEvents();
  const { openEvent } = useEventExpand();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [day, setDay] = useState<DayKey | 'All'>('All');
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [price, setPrice] = useState<PriceFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const venues = useMemo(() => {
    return [...new Set(events.map((event) => event.venue))].sort((a, b) => a.localeCompare(b));
  }, [events]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((event) => {
      if (!matchesDayChip(event.startDate, day)) return false;
      if (!matchesVenueFilter(event.venue, selectedVenues, venues)) return false;
      if (price === 'free' && event.isFree !== true) return false;
      if (price === 'paid' && event.isFree !== false) return false;
      if (!q) return true;
      return (
        event.title.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q) ||
        event.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, day, selectedVenues, price, events, venues]);

  const grouped = useMemo(() => groupEventsByDate(filtered), [filtered]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const filtersOn = day !== 'All' || selectedVenues.length > 0 || price !== 'all';
  const clearFilters = () => {
    setDay('All');
    setSelectedVenues([]);
    setPrice('all');
  };

  const empty = (
    <View style={styles.fail}>
      <EmptyState icon={Search} title="No matching nights" message="Clear a filter or try another venue." />
      {filtersOn ? <Button label="Clear filters" variant="secondary" onPress={clearFilters} /> : null}
    </View>
  );

  return (
    <Screen
      scroll={activeView !== 'map'}
      onRefresh={activeView === 'map' ? undefined : onRefresh}
      refreshing={refreshing}
      keyboard={activeView !== 'map'}
      contentStyle={activeView === 'map' ? styles.mapScreen : undefined}
    >
      <View style={styles.page}>
        <View style={styles.headRow}>
          <Text style={styles.title} accessibilityRole="header">
            Explore
          </Text>
          <View style={styles.toggle}>
            <Pressable
              onPress={() => {
                selectionTick();
                setActiveView('list');
              }}
              style={[styles.toggleBtn, activeView === 'list' && styles.toggleOn, webCursor]}
              accessibilityRole="button"
              accessibilityLabel="List view"
              accessibilityState={{ selected: activeView === 'list' }}
            >
              <List size={18} color={activeView === 'list' ? colors.accentFg : colors.muted} strokeWidth={2.2} />
            </Pressable>
            <Pressable
              onPress={() => {
                selectionTick();
                setActiveView('map');
              }}
              style={[styles.toggleBtn, activeView === 'map' && styles.toggleOn, webCursor]}
              accessibilityRole="button"
              accessibilityLabel="Map view"
              accessibilityState={{ selected: activeView === 'map' }}
            >
              <Map size={18} color={activeView === 'map' ? colors.accentFg : colors.muted} strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
        <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
        <ExploreFilters
          day={day}
          onDayChange={setDay}
          venues={venues}
          selectedVenues={selectedVenues}
          onVenuesChange={setSelectedVenues}
          price={price}
          onPriceChange={setPrice}
        />
        {error ? (
          <View style={styles.fail}>
            <EmptyState icon={WifiOff} title="Couldn’t load nights" message={error} />
            <Button label="Try again" onPress={() => void refresh()} />
          </View>
        ) : null}
        {loading && events.length === 0 ? (
          <View style={styles.list}>
            <Skeleton style={styles.sk} />
            <Skeleton style={styles.sk} />
            <Skeleton style={styles.sk} />
          </View>
        ) : activeView === 'list' ? (
          <View style={styles.list}>
            {filtered.length === 0 ? empty : (
              grouped.map((group) => (
                <View key={group.ymd} style={styles.dayGroup}>
                  <Text style={styles.dayLabel}>{group.label}</Text>
                  {group.items.map((event) => (
                    <EventCard key={`${event.id}-${event.startDate}`} event={event} variant="list" instanceId="explore" />
                  ))}
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.mapBlock}>
            {filtered.length === 0 ? empty : null}
            <View style={styles.map}>
              <MapWidget
                events={filtered}
                interactive
                onSelectEvent={(event) => openEvent(event.id, 'explore-map')}
              />
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: layout.sheetMax,
    alignSelf: 'center',
    paddingHorizontal: space.lg,
    gap: space.md,
    flex: 1,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...type.display, fontSize: 40, lineHeight: 42 },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.full,
    padding: 4,
  },
  toggleBtn: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: colors.highlighter },
  list: { gap: 20, marginTop: 8 },
  dayGroup: { gap: 12 },
  dayLabel: { ...type.section },
  mapScreen: { flex: 1, paddingTop: space.lg },
  mapBlock: { flex: 1, gap: 8, minHeight: 280 },
  map: { flex: 1, minHeight: 280, borderRadius: radius.xl, overflow: 'hidden' },
  fail: { gap: 12 },
  sk: { height: 88, borderRadius: 12 },
});
