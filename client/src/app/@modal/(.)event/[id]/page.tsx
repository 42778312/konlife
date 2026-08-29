'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useEventExpand } from '@/components/events/EventExpandContext';

export default function InterceptedEventPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const { source, openEvent } = useEventExpand();

  useEffect(() => {
    if (eventId && !source) {
      openEvent(eventId, `intercept-${eventId}`);
    }
  }, [eventId, openEvent, source]);

  return null;
}
