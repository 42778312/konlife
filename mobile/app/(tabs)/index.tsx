import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_EVENTS, type DayKey } from '@/data/mockEvents';
import { colors, fonts } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { EventCard } from '@/components/events/EventCard';
import { HeroSlideshow } from '@/components/events/HeroSlideshow';
import { CategoryFilterBar } from '@/components/events/CategoryFilterBar';
import { DayPills } from '@/components/ui/DayPills';

const WEEKEND_DAYS = new Set(['Fri', 'Sat', 'Sun']);

function weekendHighlights() {
  const weekend = MOCK_EVENTS.filter((e) => WEEKEND_DAYS.has(e.dayOfWeek));
  const featured = weekend.filter((e) => e.isFeatured);
  const rest = weekend.filter((e) => !e.isFeatured && e.isPopular);
  return [...featured, ...rest].slice(0, 5);
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<DayKey>('Today');
  const [selectedCategory, setSelectedCategory] = useState('Student');
  const [refreshing, setRefreshing] = useState(false);

  const heroEvents = weekendHighlights();
  const weekendEvents = MOCK_EVENTS.filter((e) => e.dayOfWeek === 'Sat' || e.dayOfWeek === 'Fri').slice(0, 3);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  return (
    <Screen
      header={<MobileHeader onSearchPress={() => router.push('/discover')} />}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <View style={styles.stack}>
        <DayPills selected={selectedDay} onSelect={setSelectedDay} />

        <HeroSlideshow events={heroEvents} />

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>This Weekend</Text>
          <Pressable onPress={() => router.push('/discover')} hitSlop={8} style={styles.seeAll}>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
          decelerationRate="fast"
          nestedScrollEnabled
          directionalLockEnabled
        >
          {weekendEvents.map((event) => (
            <EventCard key={event.id} event={event} variant="horizontal" />
          ))}
        </ScrollView>

        <CategoryFilterBar activeCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 20,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.white,
    letterSpacing: 0.8,
  },
  seeAll: {
    minHeight: 32,
    justifyContent: 'center',
    cursor: 'pointer',
  },
  seeAllText: {
    fontFamily: fonts.extrabold,
    fontSize: 12,
    color: colors.neon,
  },
  hScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
});
