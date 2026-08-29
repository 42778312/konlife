'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { WebHeader } from '@/components/layout/WebHeader';
import { EventDetailView } from '@/components/events/EventDetailView';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const event = MOCK_EVENTS.find((item) => item.id === eventId) || MOCK_EVENTS[0];

  return (
    <div className="min-h-screen bg-[#080809] text-zinc-100 flex flex-col pb-20 md:pb-0">
      <div className="hidden md:block">
        <WebHeader />
      </div>
      <EventDetailView event={event} />
    </div>
  );
}
