import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'saved_event_ids';

type SavedEventsContextValue = {
  savedIds: Set<string>;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
};

const SavedEventsContext = createContext<SavedEventsContextValue | null>(null);

export function SavedEventsProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  // Load persisted IDs on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const ids: string[] = JSON.parse(raw);
          setSavedIds(new Set(ids));
        }
      })
      .catch(() => {/* ignore read errors */});
  }, []);

  // Persist whenever savedIds changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...savedIds])).catch(() => {/* ignore write errors */});
  }, [savedIds]);

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
