import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvents } from '@/context/EventsProvider';
import { useEventExpand } from '@/context/EventExpandContext';
import { EventDetailView } from '@/components/events/EventDetailView';
import { Button } from '@/components/ui/Button';
import { colors, space, type } from '@/constants/theme';
import { decodeEventShareId, firstSearchParam } from '@/lib/shareId';

export default function SharedEventPage() {
  const code = firstSearchParam(useLocalSearchParams<{ code: string | string[] }>().code);
  const id = code ? decodeEventShareId(code) : null;
  const router = useRouter();
  const { source } = useEventExpand();
  const { getById, ensureEvent, loading } = useEvents();
  const event = id ? getById(id) : undefined;
  const [lookup, setLookup] = useState<'idle' | 'pending' | 'done'>(id && !event ? 'pending' : 'idle');

  useEffect(() => {
    if (!id || event) {
      setLookup('done');
      return;
    }
    let cancelled = false;
    setLookup('pending');
    void ensureEvent(id).finally(() => {
      if (!cancelled) setLookup('done');
    });
    return () => {
      cancelled = true;
    };
  }, [id, event, ensureEvent]);

  if (source) {
    return null;
  }

  if (!event) {
    const waiting = Boolean(id) && (loading || lookup !== 'done');
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>
          {waiting ? 'Loading this night…' : 'This night isn’t on the Konstanz list.'}
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
