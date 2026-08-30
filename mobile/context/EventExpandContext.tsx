import React, { createContext, useContext } from 'react';
import type { SourceRect } from '@/lib/eventMotion';

export type EventExpandSource = {
  eventId: string;
  instanceId: string;
  rect?: SourceRect | null;
};

type EventExpandContextValue = {
  source: EventExpandSource | null;
  openEvent: (eventId: string, instanceId: string, rect?: SourceRect | null) => void;
  closeEvent: () => void;
};

const EventExpandContext = createContext<EventExpandContextValue | null>(null);

export function useEventExpand() {
  const value = useContext(EventExpandContext);
  if (!value) {
    throw new Error('useEventExpand must be used within EventExpandProvider');
  }
  return value;
}

export function useCardCovered(eventId: string, instanceId: string) {
  const { source } = useEventExpand();
  return source?.eventId === eventId && source?.instanceId === instanceId;
}

export const EventExpandContextProvider: React.FC<{
  value: EventExpandContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <EventExpandContext.Provider value={value}>{children}</EventExpandContext.Provider>;
};
