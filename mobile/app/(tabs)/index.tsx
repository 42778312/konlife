import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_EVENTS, type DayKey } from '@/data/mockEvents';
import { colors, layout, space, type } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Chip } from '@/components/ui/Chip';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const WEEKEND: DayKey[] = ['Fri', 'Sat', 'Sun'];

export default function HomeScreen() {
  const router = useRouter();
  const { desktop } = useBreakpoint();
  const [query, setQuery] = useState('');
  const [day, setDay] = useState<DayKey | 'All'>('All');
  const [refreshing, setRefreshing] = useState(false);

  const featured = MOCK_EVENTS.find((e) => e.isFeatured) ?? MOCK_EVENTS[0];
  const thisWeek = useMemo(() => {
    return MOCK_EVENTS.filter((e) => WEEKEND.includes(e.dayOfWeek as DayKey)).filter((e) => e.id !== featured.id);
  }, [featured.id]);

  const happening = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_EVENTS.filter((e) => {
      if (day !== 'All' && e.dayOfWeek !== day) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, day]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <View style={styles.page}>
        <View style={styles.intro}>
          <Text style={styles.headline} accessibilityRole="header">
            Out this week
          </Text>
          <Text style={styles.lede}>Nights worth leaving the house for in Konstanz.</Text>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search nights, venues, genres"
            variant="pill"
          />
        </View>

        {featured ? <EventCard event={featured} variant="featured" instanceId="home-featured" /> : null}

        <SectionHeader title="This week" actionLabel="See all" onAction={() => router.push('/weekend')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
          decelerationRate="fast"
          nestedScrollEnabled
        >
          {thisWeek.map((event) => (
            <EventCard key={event.id} event={event} variant="horizontal" instanceId="home-week" />
          ))}
        </ScrollView>

        <SectionHeader title="Happening" />
        <View style={styles.days}>
          <Chip label="All" selected={day === 'All'} onPress={() => setDay('All')} />
          <Chip label="Fri" selected={day === 'Fri'} onPress={() => setDay('Fri')} />
          <Chip label="Sat" selected={day === 'Sat'} onPress={() => setDay('Sat')} />
          <Chip label="Sun" selected={day === 'Sun'} onPress={() => setDay('Sun')} />
        </View>
        <View style={[styles.grid, desktop && styles.gridDesk]}>
          {happening.map((event) => (
            <View key={event.id} style={desktop ? styles.gridItem : undefined}>
              <EventCard event={event} variant={desktop ? 'standard' : 'list'} instanceId="home-list" />
            </View>
          ))}
        </View>
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
    gap: space['2xl'],
  },
  intro: { gap: 10 },
  headline: { ...type.display },
  lede: { ...type.body, maxWidth: 420, marginBottom: 4 },
  hScroll: { flexDirection: 'row', gap: 12, paddingBottom: 4 },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -12 },
  grid: { gap: 12 },
  gridDesk: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '48%', flexGrow: 1 },
});
