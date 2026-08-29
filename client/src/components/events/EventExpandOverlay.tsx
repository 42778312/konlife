'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { EventDetailView } from '@/components/events/EventDetailView';
import { EVENT_OVERLAY_FADE, eventLayoutIds } from '@/lib/eventMotion';

interface EventExpandOverlayProps {
  eventId: string;
  instanceId: string;
  onClose: () => void;
}

export const EventExpandOverlay: React.FC<EventExpandOverlayProps> = ({
  eventId,
  instanceId,
  onClose,
}) => {
  const event = MOCK_EVENTS.find((item) => item.id === eventId) || MOCK_EVENTS[0];
  const layoutIds = eventLayoutIds(event.id, instanceId);

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1, pointerEvents: 'none' }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-black/75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={EVENT_OVERLAY_FADE}
        onClick={onClose}
        aria-hidden
      />

      <motion.div layoutRoot className="absolute inset-0 overflow-hidden">
        <EventDetailView
          event={event}
          layoutIds={layoutIds}
          instanceId={instanceId}
          onClose={onClose}
        />
      </motion.div>
    </motion.div>
  );
};
