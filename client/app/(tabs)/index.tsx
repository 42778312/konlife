import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { CalendarDays, Download, List, Search, WifiOff } from 'lucide-react-native';
import { type DayKey } from '@/data/mockEvents';
import { groupEventsByDate, matchesDayChip } from '@/lib/partyInsider/dates';
import { matchesVenueFilter, type PriceFilter } from '@/lib/exploreFilters';
import { colors, fonts, layout, MIN_TOUCH, radius, space, type, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { useEvents } from '@/context/EventsProvider';
import { Screen } from '@/components/layout/Screen';
import { TicketEventCard } from '@/components/events/TicketEventCard';
import { EventDetailBody } from '@/components/events/EventDetailBody';
import { WeekendCalendarView } from '@/components/events/WeekendCalendarView';
import { SearchInput } from '@/components/ui/SearchInput';
import { ExploreFilters } from '@/components/events/ExploreFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { useIosInstall } from '@/components/pwa/IosInstallProvider';

function greeting(hour: number): string {
  if (hour < 5) return 'Still up?';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { events, loading, error, refresh } = useEvents();
  const { eligible: installEligible, open: openInstall } = useIosInstall();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'weekend'>('list');
  const [day, setDay] = useState<DayKey | 'All'>('All');
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [price, setPrice] = useState<PriceFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

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
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <View style={styles.page}>
        <View style={styles.brandRow}>
          <View style={styles.mark} accessibilityLabel="KonVita">
            <Image source={require('@/assets/images/icon.png')} style={styles.markImage} />
          </View>
          <Text style={styles.city}>Konstanz</Text>
          {installEligible ? (
            <IconButton
              icon={Download}
              variant="circle"
              color={colors.highlighter}
              size={18}
              accessibilityLabel="Install on iPhone"
              onPress={openInstall}
            />
          ) : (
            <View style={styles.markSpacer} />
          )}
        </View>

        <View style={styles.headRow}>
          <View style={styles.headText}>
            <Text style={styles.title} accessibilityRole="header">
              {greeting(new Date().getHours())}
            </Text>
            <Text style={styles.subtitle}>
              {filtered.length} {filtered.length === 1 ? 'night' : 'nights'} lined up
            </Text>
          </View>
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
                setActiveView('weekend');
              }}
              style={[styles.toggleBtn, activeView === 'weekend' && styles.toggleOn, webCursor]}
              accessibilityRole="button"
              accessibilityLabel="Weekend view"
              accessibilityState={{ selected: activeView === 'weekend' }}
            >
              <CalendarDays
                size={18}
                color={activeView === 'weekend' ? colors.accentFg : colors.muted}
                strokeWidth={2.2}
              />
            </Pressable>
          </View>
        </View>

        {activeView === 'list' ? (
          <>
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
          </>
        ) : null}
        {error && activeView === 'list' ? (
          <View style={styles.fail}>
            <EmptyState icon={WifiOff} title="Couldn’t load nights" message={error} />
            <Button label="Try again" onPress={() => void refresh()} />
          </View>
        ) : null}
        {activeView === 'weekend' ? (
          <WeekendCalendarView />
        ) : loading && events.length === 0 ? (
          <View style={styles.list}>
            <Skeleton style={styles.sk} />
            <Skeleton style={styles.sk} />
            <Skeleton style={styles.sk} />
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.length === 0 ? empty : (
              grouped.map((group) => (
                <View key={group.ymd} style={styles.dayGroup}>
                  <Text style={styles.dayLabel}>{group.label}</Text>
                  {group.items.map((event) => {
                    const key = `${event.id}-${event.startDate}`;
                    const isExpanded = expandedKey === key;
                    return (
                      <View key={key}>
                        <TicketEventCard
                          event={event}
                          expanded={isExpanded}
                          onPress={() => {
                            selectionTick();
                            setExpandedKey((current) => (current === key ? null : key));
                          }}
                        />
                        {isExpanded ? (
                          <Animated.View
                            entering={FadeIn.duration(160)}
                            exiting={FadeOut.duration(120)}
                            style={styles.detailPanel}
                          >
                            <EventDetailBody event={event} surface="panel" />
                          </Animated.View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              ))
            )}
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.circle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markImage: { width: 32, height: 32 },
  markSpacer: { width: MIN_TOUCH },
  city: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headText: { flex: 1, minWidth: 0, gap: 2 },
  title: { ...type.display, fontSize: 36, lineHeight: 40 },
  subtitle: { ...type.meta },
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
  detailPanel: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: 'hidden',
  },
  dayLabel: { ...type.section },
  fail: { gap: 12 },
  sk: { height: 88, borderRadius: 12 },
});
