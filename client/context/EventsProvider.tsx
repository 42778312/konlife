import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { EventItem } from '@/data/mockEvents';
import { fetchKonstanzEvents } from '@/lib/api/events';

type EventsContextValue = {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => EventItem | undefined;
};

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (bypassCache = false) => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchKonstanzEvents({ bypassCache });
      setEvents(next);
    } catch (err) {
      setEvents([]);
      setError(err instanceof Error ? err.message : 'Could not load nights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  const getById = useCallback((id: string) => events.find((event) => event.id === id), [events]);

  const value = useMemo(
    () => ({ events, loading, error, refresh, getById }),
    [events, loading, error, refresh, getById],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents(): EventsContextValue {
  const value = useContext(EventsContext);
  if (!value) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return value;
}
