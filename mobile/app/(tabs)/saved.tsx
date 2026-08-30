import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { colors, fonts } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { EventCard } from '@/components/events/EventCard';

export default function SavedScreen() {
  const savedEvents = MOCK_EVENTS.filter((e) => e.isSaved);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  return (
    <Screen header={<MobileHeader />} onRefresh={onRefresh} refreshing={refreshing}>
      <View style={styles.heading}>
        <Bookmark size={24} color={colors.neon} strokeWidth={2.2} />
        <Text style={styles.title}>Saved Events</Text>
      </View>
      <View style={styles.list}>
        {savedEvents.map((event) => (
          <EventCard key={event.id} event={event} variant="list" instanceId="mobile-saved" />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.white,
    letterSpacing: 0.8,
  },
  list: {
    gap: 12,
  },
});
