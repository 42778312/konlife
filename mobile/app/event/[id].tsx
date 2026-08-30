import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { useEventExpand } from '@/context/EventExpandContext';
import { EventDetailView } from '@/components/events/EventDetailView';
import { colors } from '@/constants/theme';

export default function EventPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { source } = useEventExpand();
  const event = MOCK_EVENTS.find((item) => item.id === id) || MOCK_EVENTS[0];

  if (source) {
    return null;
  }

  return (
    <View style={styles.root}>
      <EventDetailView event={event} onClose={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
