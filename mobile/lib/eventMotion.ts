export type SourceRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

/** iOS App Store-like spring used for shared-element expand/collapse. */
export const EVENT_EXPAND_SPRING = {
  damping: 18,
  stiffness: 220,
  mass: 0.85,
  overshootClamping: false,
};

export const EVENT_OVERLAY_FADE_MS = 280;

export const EVENT_SWIPE_BACK = {
  edgePx: 32,
  threshold: 0.28,
  velocityPxPerS: 450,
  spring: {
    damping: 42,
    stiffness: 460,
    mass: 0.75,
  },
};
