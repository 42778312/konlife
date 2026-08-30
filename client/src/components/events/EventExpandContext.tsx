'use client';

import React, { createContext, useContext } from 'react';
import { EVENT_EXPAND_TRANSITION, INSTANT_LAYOUT, eventLayoutIds, EventLayoutIds } from '@/lib/eventMotion';

export type EventExpandSource = {
  eventId: string;
  instanceId: string;
};

type EventLayoutTransition = typeof EVENT_EXPAND_TRANSITION | typeof INSTANT_LAYOUT;

type EventExpandContextValue = {
  source: EventExpandSource | null;
  openEvent: (eventId: string, instanceId: string) => void;
  closeEvent: () => void;
  sharedElement: boolean;
  layoutInstant: boolean;
  detachSharedElement: () => void;
};

const EventExpandContext = createContext<EventExpandContextValue | null>(null);

export function useEventExpand() {
  const value = useContext(EventExpandContext);
  if (!value) {
    throw new Error('useEventExpand must be used within EventExpandProvider');
  }
  return value;
}

export function useSharedLayout(eventId: string, instanceId: string): {
  ids: EventLayoutIds | undefined;
  transition: EventLayoutTransition;
  covered: boolean;
} {
  const { source, sharedElement, layoutInstant } = useEventExpand();
  const isActiveSource = source?.eventId === eventId && source?.instanceId === instanceId;

  if (!sharedElement) {
    return { ids: undefined, transition: INSTANT_LAYOUT, covered: false };
  }

  return {
    ids: eventLayoutIds(eventId, instanceId),
    transition: layoutInstant ? INSTANT_LAYOUT : EVENT_EXPAND_TRANSITION,
    covered: isActiveSource,
  };
}

export const EventExpandContextProvider: React.FC<{
  value: EventExpandContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <EventExpandContext.Provider value={value}>{children}</EventExpandContext.Provider>;
};
