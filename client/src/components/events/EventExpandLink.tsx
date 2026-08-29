'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEventExpand } from '@/components/events/EventExpandContext';

interface EventExpandLinkProps {
  eventId: string;
  instanceId: string;
  label: string;
  className?: string;
}

export const EventExpandLink: React.FC<EventExpandLinkProps> = ({
  eventId,
  instanceId,
  label,
  className = 'absolute inset-0 z-10 cursor-pointer',
}) => {
  const pathname = usePathname();
  const { openEvent, source } = useEventExpand();

  return (
    <Link
      href={`/event/${eventId}`}
      scroll={false}
      replace={Boolean(source && pathname.startsWith('/event/'))}
      onClick={() => {
        if (pathname.startsWith('/event/') && !source) return;
        openEvent(eventId, instanceId);
      }}
      className={className}
      aria-label={label}
    />
  );
};
