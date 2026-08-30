import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { MOCK_EVENTS } from '@/data/mockEvents';

type SavedEventsContextValue = {
  savedIds: Set<string>;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
};

const SavedEventsContext = createContext<SavedEventsContextValue | null>(null);

export function SavedEventsProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(MOCK_EVENTS.filter((e) => e.isSaved).map((e) => e.id)),
  );

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ savedIds, isSaved, toggleSaved }),
    [savedIds, isSaved, toggleSaved],
  );

  return <SavedEventsContext.Provider value={value}>{children}</SavedEventsContext.Provider>;
}

export function useSavedEvents() {
  const value = useContext(SavedEventsContext);
  if (!value) {
    throw new Error('useSavedEvents must be used within SavedEventsProvider');
  }
  return value;
}
