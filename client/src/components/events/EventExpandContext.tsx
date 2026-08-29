'use client';

import React, { createContext, useContext } from 'react';

export type EventExpandSource = {
  eventId: string;
  instanceId: string;
};

type EventExpandContextValue = {
  source: EventExpandSource | null;
  openEvent: (eventId: string, instanceId: string) => void;
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

export const EventExpandContextProvider: React.FC<{
  value: EventExpandContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <EventExpandContext.Provider value={value}>{children}</EventExpandContext.Provider>;
};
