import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { EventExpandContextProvider, EventExpandSource } from '@/context/EventExpandContext';
import { EventExpandOverlay } from '@/components/events/EventExpandOverlay';
import type { SourceRect } from '@/lib/eventMotion';
import { decodeEventShareId, encodeEventShareId } from '@/lib/shareId';

export const EventExpandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [source, setSource] = useState<EventExpandSource | null>(null);

  const eventIdFromPath = useMemo(() => {
    const share = pathname.match(/^\/e\/([^/]+)$/);
    if (share?.[1]) return decodeEventShareId(share[1]);
    const legacy = pathname.match(/^\/event\/([^/]+)$/);
    if (legacy?.[1]) return decodeEventShareId(legacy[1]);
    return null;
  }, [pathname]);

  useEffect(() => {
    if (!eventIdFromPath) {
      setSource(null);
    }
  }, [eventIdFromPath]);

  const openEvent = useCallback(
    (eventId: string, instanceId: string, rect?: SourceRect | null) => {
      setSource({ eventId, instanceId, rect: rect ?? null });
      router.push({ pathname: '/e/[code]', params: { code: encodeEventShareId(eventId) } });
    },
    [router],
  );

  const closeEvent = useCallback(() => {
    if (eventIdFromPath) {
      router.back();
      return;
    }
    setSource(null);
  }, [eventIdFromPath, router]);

  const value = useMemo(
    () => ({
      source,
      openEvent,
      closeEvent,
    }),
    [source, openEvent, closeEvent],
  );

  return (
    <EventExpandContextProvider value={value}>
      <View style={styles.root}>
        {children}
        {source ? (
          <EventExpandOverlay
            eventId={source.eventId}
            instanceId={source.instanceId}
            rect={source.rect}
            onClose={closeEvent}
          />
        ) : null}
      </View>
    </EventExpandContextProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
