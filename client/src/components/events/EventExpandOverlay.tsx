'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { EventDetailView } from '@/components/events/EventDetailView';
import { useEventSwipeBack } from '@/components/events/useEventSwipeBack';
import { useEventExpand, useSharedLayout } from '@/components/events/EventExpandContext';
import { EVENT_OVERLAY_FADE } from '@/lib/eventMotion';

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
  const { sharedElement } = useEventExpand();
  const { ids: layoutIds } = useSharedLayout(event.id, instanceId);
  const { x, borderRadius, boxShadow, swipeFade, dismissedBySwipe } = useEventSwipeBack(onClose);
  const skipLayout = !sharedElement || dismissedBySwipe;

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      initial={false}
      animate={{ opacity: 1 }}
      exit={
        skipLayout
          ? { opacity: 0, transition: { duration: 0 } }
          : { opacity: 1, pointerEvents: 'none' }
      }
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
    >
      <motion.div style={{ opacity: swipeFade }} className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-black/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={skipLayout ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
          transition={EVENT_OVERLAY_FADE}
          onClick={onClose}
          aria-hidden
        />
      </motion.div>

      <motion.div
        layoutRoot={sharedElement}
        className="absolute inset-0 overflow-hidden bg-[#080809] will-change-transform"
        style={{ x, borderRadius, boxShadow }}
      >
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 z-30 w-8 md:hidden"
          style={{ touchAction: 'none' }}
        />
        <EventDetailView
          event={event}
          layoutIds={skipLayout ? undefined : layoutIds}
          instanceId={instanceId}
          onClose={onClose}
        />
      </motion.div>
    </motion.div>
  );
};
