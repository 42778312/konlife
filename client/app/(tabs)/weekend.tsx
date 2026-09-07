import React, { useCallback, useState } from 'react';
import { Screen } from '@/components/layout/Screen';
import { WeekendCalendarView } from '@/components/events/WeekendCalendarView';
import { useEvents } from '@/context/EventsProvider';

export default function WeekendScreen() {
  const { refresh } = useEvents();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <WeekendCalendarView />
    </Screen>
  );
}
