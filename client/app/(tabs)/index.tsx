import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarX, SlidersHorizontal, WifiOff } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import { localYmd } from '@/lib/partyInsider/dates';
import { webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { useEvents } from '@/context/EventsProvider';
import { Screen } from '@/components/layout/Screen';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSectionRow } from '@/components/home/HomeSectionRow';
import { CategoryPills, type CategoryThumb } from '@/components/home/CategoryPills';
import { HomeFeaturedCard } from '@/components/home/HomeFeaturedCard';
import { HomePosterCard } from '@/components/home/HomePosterCard';
import { CHROME, HOME_MAX, home, PLATE_RADIUS, POSTER_GAP, POSTER_H, POSTER_W } from '@/components/home/tokens';

function matchesQuery(event: EventItem, q: string): boolean {
  if (!q) return true;
  return (
    event.title.toLowerCase().includes(q) ||
    event.venue.toLowerCase().includes(q) ||
    event.category.toLowerCase().includes(q) ||
    event.tags.some((t) => t.toLowerCase().includes(q))
  );
}

function categoryKey(event: EventItem): string {
  return event.category.trim() || 'Night';
}

export default function HomeScreen() {
  const router = useRouter();
  const { events, loading, error, refresh } = useEvents();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const today = localYmd(new Date());

  const upcoming = useMemo(() => {
    return events
      .filter((event) => {
        const ymd = event.startDate ?? '';
        return !ymd || ymd >= today;
      })
      .sort((a, b) => {
        const byDate = (a.startDate ?? '').localeCompare(b.startDate ?? '');
        if (byDate) return byDate;
        return a.time.localeCompare(b.time);
      });
  }, [events, today]);

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return upcoming.filter((event) => matchesQuery(event, q));
  }, [upcoming, query]);

  const categories = useMemo((): CategoryThumb[] => {
    const seen = new Map<string, CategoryThumb>();
    for (const event of upcoming) {
      const id = categoryKey(event);
      if (seen.has(id)) continue;
      seen.set(id, { id, label: id, image: event.image });
    }
    return [...seen.values()];
  }, [upcoming]);

  const selected =
    (category && categories.some((item) => item.id === category) ? category : null) ??
    (searched[0] ? categoryKey(searched[0]) : categories[0]?.id ?? '');

  const inCategory = useMemo(() => {
    if (!selected) return searched;
    const scoped = searched.filter((event) => categoryKey(event) === selected);
    return scoped.length ? scoped : searched;
  }, [searched, selected]);

  const featured = inCategory.find((event) => event.isFeatured || event.isPopular) ?? inCategory[0];
  const posters = useMemo(() => {
    const rest = inCategory.filter((event) => event.id !== featured?.id);
    if (rest.length >= 3) return rest.slice(0, 10);
    const extra = searched.filter((event) => event.id !== featured?.id && !rest.some((r) => r.id === event.id));
    return [...rest, ...extra].slice(0, 10);
  }, [inCategory, featured?.id, searched]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const goExplore = () => router.push('/discover');

  return (
    <Screen
      onRefresh={onRefresh}
      refreshing={refreshing}
      backgroundColor={home.ground}
      contentStyle={styles.screen}
    >
      <View style={styles.page}>
        <HomeHeader />

        <View style={styles.searchRow}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="Discover"
            variant="pill"
            surfaceColor={home.plate}
            compact
            style={styles.search}
          />
          <Pressable
            onPress={() => {
              selectionTick();
              goExplore();
            }}
            style={[styles.filter, webCursor]}
            accessibilityRole="button"
            accessibilityLabel="Explore filters"
          >
            <SlidersHorizontal size={20} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>

        {error ? (
          <View style={styles.fail}>
            <EmptyState icon={WifiOff} title="Couldn’t load nights" message={error} />
            <Button label="Try again" onPress={() => void refresh()} />
          </View>
        ) : null}

        {loading && events.length === 0 ? (
          <View style={styles.skeletons}>
            <Skeleton style={styles.skPills} />
            <Skeleton style={styles.skHero} />
            <Skeleton style={styles.skPosters} />
          </View>
        ) : null}

        {categories.length > 0 ? (
          <View style={styles.block}>
            <HomeSectionRow title="Categories" actionLabel="See all" onAction={goExplore} />
            <CategoryPills categories={categories} selected={selected} onSelect={setCategory} />
          </View>
        ) : null}

        {featured ? <HomeFeaturedCard event={featured} instanceId="home-featured" /> : null}

        {posters.length > 0 ? (
          <View style={styles.block}>
            <HomeSectionRow title="Top nights in Konstanz" actionLabel="See all" onAction={goExplore} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.posters}
              decelerationRate="fast"
              nestedScrollEnabled
              snapToInterval={POSTER_W + POSTER_GAP}
              snapToAlignment="start"
              disableIntervalMomentum
            >
              {posters.map((event) => (
                <View key={event.id} style={styles.posterItem}>
                  <HomePosterCard event={event} instanceId="home-poster" />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {!loading && !error && searched.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title="No nights match"
            message="Clear search or open Explore for the full list."
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
    paddingTop: 0,
    backgroundColor: home.ground,
  },
  page: {
    width: '100%',
    maxWidth: HOME_MAX,
    alignSelf: 'center',
    gap: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  search: {
    flex: 1,
    minWidth: 0,
  },
  filter: {
    width: CHROME,
    height: CHROME,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: home.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: { gap: 8 },
  posters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  posterItem: {
    marginRight: POSTER_GAP,
  },
  fail: { gap: 12 },
  skeletons: { gap: 16 },
  skPills: { height: 48, borderRadius: 999 },
  skHero: { height: 360, borderRadius: PLATE_RADIUS },
  skPosters: { height: POSTER_H, borderRadius: 22 },
});
