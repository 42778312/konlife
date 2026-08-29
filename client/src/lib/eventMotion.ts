export type EventLayoutIds = {
  container: string;
  image: string;
  title: string;
};

export function eventLayoutIds(eventId: string, instanceId: string): EventLayoutIds {
  return {
    container: `event-container-${eventId}-${instanceId}`,
    image: `event-image-${eventId}-${instanceId}`,
    title: `event-title-${eventId}-${instanceId}`,
  };
}

/** iOS App Store-like spring used for shared-element expand/collapse. */
export const EVENT_EXPAND_TRANSITION = {
  type: 'spring' as const,
  bounce: 0.15,
  duration: 0.55,
};

export const EVENT_OVERLAY_FADE = {
  duration: 0.28,
  ease: [0.32, 0.72, 0, 1] as const,
};
