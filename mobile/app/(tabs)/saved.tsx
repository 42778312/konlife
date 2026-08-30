import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { layout, space, type } from '@/constants/theme';
import { useEvents } from '@/context/EventsProvider';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function SavedScreen() {
  const { events, refresh } = useEvents();
  const { isSaved } = useSavedEvents();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const savedEvents = useMemo(() => events.filter((e) => isSaved(e.id)), [events, isSaved]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

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
