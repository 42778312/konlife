import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { layout, space, type } from '@/constants/theme';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function SavedScreen() {
  const { isSaved } = useSavedEvents();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const savedEvents = useMemo(() => MOCK_EVENTS.filter((e) => isSaved(e.id)), [isSaved]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <View style={styles.page}>
        <View style={styles.head}>
          <Text style={styles.title} accessibilityRole="header">
            Saved
          </Text>
          <Text style={styles.sub}>Nights you marked. Tap a photo to open it.</Text>
        </View>
        {savedEvents.length === 0 ? (
          <View style={styles.empty}>
            <EmptyState
              icon={Bookmark}
              title="Nothing saved yet"
              message="Tap the bookmark on a night you want to go to."
            />
            <Button label="Find a night" onPress={() => router.push('/')} />
          </View>
        ) : (
          <View style={styles.list}>
            {savedEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="list" instanceId="saved" />
            ))}
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
    gap: space.lg,
  },
  head: { gap: 8 },
  title: { ...type.display, fontSize: 40, lineHeight: 42 },
  sub: { ...type.body, maxWidth: 420 },
  list: { gap: 12 },
  empty: { gap: 16, alignItems: 'flex-start' },
});
