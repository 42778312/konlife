import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvents } from '@/context/EventsProvider';
import { useEventExpand } from '@/context/EventExpandContext';
import { EventDetailView } from '@/components/events/EventDetailView';
import { Button } from '@/components/ui/Button';
import { colors, space, type } from '@/constants/theme';

export default function EventPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { source } = useEventExpand();
  const { getById, loading } = useEvents();
  const event = id ? getById(id) : undefined;

  if (source) {
    return null;
  }

  if (!event) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>
          {loading ? 'Loading this night…' : 'This night isn’t on the Konstanz list.'}
        </Text>
        <Button label="Back home" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      </View>
    );
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
  missing: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space['2xl'],
    gap: 16,
  },
  missingTitle: {
    ...type.section,
    color: colors.fg,
    textAlign: 'center',
  },
});
