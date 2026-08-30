import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_EVENTS, type DayKey } from '@/data/mockEvents';
import { colors, fonts } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { EventCard } from '@/components/events/EventCard';
import { CategoryFilterBar } from '@/components/events/CategoryFilterBar';
import { DayPills } from '@/components/ui/DayPills';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<DayKey>('Today');
  const [selectedCategory, setSelectedCategory] = useState('Student');
  const [refreshing, setRefreshing] = useState(false);

  const heroMobileEvent = MOCK_EVENTS.find((e) => e.id === 'student-night') || MOCK_EVENTS[0];
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

        <EventCard event={heroMobileEvent} variant="hero" />

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
