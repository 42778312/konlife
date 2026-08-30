import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { List, Map, Search } from 'lucide-react-native';
import { CATEGORIES, DAYS, MOCK_EVENTS, type DayKey } from '@/data/mockEvents';
import { colors, layout, MIN_TOUCH, radius, space, type, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { MapWidget } from '@/components/events/MapWidget';
import { SearchInput } from '@/components/ui/SearchInput';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';

type PriceFilter = 'all' | 'free' | 'paid';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [day, setDay] = useState<DayKey | 'All'>('All');
  const [category, setCategory] = useState<string>('All');
  const [price, setPrice] = useState<PriceFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const events = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MOCK_EVENTS.filter((event) => {
      if (day !== 'All' && event.dayOfWeek !== day) return false;
      if (category !== 'All' && event.category !== category) return false;
      if (price === 'free' && !event.isFree) return false;
      if (price === 'paid' && event.isFree) return false;
      if (!q) return true;
      return (
        event.title.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, day, category, price]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

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
          <Chip label="All" selected={category === 'All'} onPress={() => setCategory('All')} />
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.label} selected={category === c.id} onPress={() => setCategory(c.id)} />
          ))}
        </View>
        <View style={styles.filters}>
          <Chip label="Any price" selected={price === 'all'} onPress={() => setPrice('all')} />
          <Chip label="Free" selected={price === 'free'} onPress={() => setPrice('free')} />
          <Chip label="Paid" selected={price === 'paid'} onPress={() => setPrice('paid')} />
        </View>
        {activeView === 'list' ? (
          <View style={styles.list}>
            {events.length === 0 ? (
              <EmptyState icon={Search} title="No matching nights" message="Clear a filter or try another venue." />
            ) : (
              events.map((event) => <EventCard key={event.id} event={event} variant="list" instanceId="explore" />)
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
  list: { gap: 12, marginTop: 8 },
  map: { minHeight: 320, borderRadius: radius.lg, overflow: 'hidden' },
});
