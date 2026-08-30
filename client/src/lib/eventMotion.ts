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

/** Used when breaking a shared-element so Framer does not replay the expand/collapse. */
export const INSTANT_LAYOUT = {
  type: 'tween' as const,
  duration: 0,
};

/** Custom iOS edge-swipe back: blocks Safari/PWA snapshot navigation. */
export const EVENT_SWIPE_BACK = {
  edgePx: 32,
  threshold: 0.28,
  velocityPxPerMs: 0.45,
  spring: {
    type: 'spring' as const,
    stiffness: 460,
    damping: 42,
    mass: 0.75,
  },
};
