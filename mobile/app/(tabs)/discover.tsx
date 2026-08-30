import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { List, Map, Search, WifiOff } from 'lucide-react-native';
import { DAYS, type DayKey } from '@/data/mockEvents';
import { groupEventsByDate, matchesDayChip } from '@/lib/partyInsider/dates';
import { colors, layout, MIN_TOUCH, radius, space, type, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { useEvents } from '@/context/EventsProvider';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { MapWidget } from '@/components/events/MapWidget';
import { SearchInput } from '@/components/ui/SearchInput';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

type PriceFilter = 'all' | 'free' | 'paid';

export default function ExploreScreen() {
  const { events, loading, error, refresh } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [day, setDay] = useState<DayKey | 'All'>('All');
  const [venue, setVenue] = useState<string>('All');
  const [price, setPrice] = useState<PriceFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const venues = useMemo(() => {
    return [...new Set(events.map((event) => event.venue))].sort((a, b) => a.localeCompare(b));
  }, [events]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((event) => {
      if (!matchesDayChip(event.startDate, day)) return false;
      if (venue !== 'All' && event.venue !== venue) return false;
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
  }, [searchQuery, day, venue, price, events]);

  const grouped = useMemo(() => groupEventsByDate(filtered), [filtered]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing} keyboard>
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
        <View style={styles.filters}>
          <Chip label="Any day" selected={day === 'All'} onPress={() => setDay('All')} />
          {DAYS.map((d) => (
            <Chip key={d} label={d} selected={day === d} onPress={() => setDay(d)} />
          ))}
        </View>
        <View style={styles.filters}>
          <Chip label="All venues" selected={venue === 'All'} onPress={() => setVenue('All')} />
          {venues.map((name) => (
            <Chip key={name} label={name} selected={venue === name} onPress={() => setVenue(name)} />
          ))}
        </View>
        <View style={styles.filters}>
          <Chip label="Any price" selected={price === 'all'} onPress={() => setPrice('all')} />
          <Chip label="Free" selected={price === 'free'} onPress={() => setPrice('free')} />
          <Chip label="Paid" selected={price === 'paid'} onPress={() => setPrice('paid')} />
        </View>
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
            {filtered.length === 0 ? (
              <EmptyState icon={Search} title="No matching nights" message="Clear a filter or try another venue." />
            ) : (
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
          <View style={styles.map}>
            <MapWidget venueName="Konstanz" cityName="Konstanz" interactive />
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
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  list: { gap: 20, marginTop: 8 },
  dayGroup: { gap: 12 },
  dayLabel: { ...type.section },
  map: { minHeight: 320, borderRadius: radius.lg, overflow: 'hidden' },
  fail: { gap: 12 },
  sk: { height: 88, borderRadius: 12 },
});
