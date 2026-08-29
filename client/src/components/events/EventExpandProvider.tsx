'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { EventExpandContextProvider, EventExpandSource } from '@/components/events/EventExpandContext';
import { EventExpandOverlay } from '@/components/events/EventExpandOverlay';

export const EventExpandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [source, setSource] = useState<EventExpandSource | null>(null);

  const eventIdFromPath = useMemo(() => {
    const match = pathname.match(/^\/event\/([^/]+)$/);
    return match ? match[1] : null;
  }, [pathname]);

  useEffect(() => {
    if (!eventIdFromPath) {
      setSource(null);
    }
  }, [eventIdFromPath]);

  useEffect(() => {
    if (!source) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [source]);

  const openEvent = useCallback((eventId: string, instanceId: string) => {
    setSource({ eventId, instanceId });
  }, []);

  const closeEvent = useCallback(() => {
    if (eventIdFromPath) {
      router.back();
      return;
    }
    setSource(null);
  }, [eventIdFromPath, router]);

  useEffect(() => {
    if (!source) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeEvent();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [source, closeEvent]);

  const value = useMemo(
    () => ({ source, openEvent, closeEvent }),
    [source, openEvent, closeEvent],
  );

  return (
    <LayoutGroup>
      <EventExpandContextProvider value={value}>
        {children}
        <AnimatePresence>
          {source ? (
            <EventExpandOverlay
              key="event-expand-overlay"
              eventId={source.eventId}
              instanceId={source.instanceId}
              onClose={closeEvent}
            />
          ) : null}
        </AnimatePresence>
      </EventExpandContextProvider>
    </LayoutGroup>
  );
};
