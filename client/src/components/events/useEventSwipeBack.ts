'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useTransform } from 'motion/react';
import { useEventExpand } from '@/components/events/EventExpandContext';
import { EVENT_SWIPE_BACK } from '@/lib/eventMotion';

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest('button, a, input, textarea, select, [role="button"]'))
  );
}

export function useEventSwipeBack(onClose: () => void) {
  const { detachSharedElement } = useEventExpand();
  const x = useMotionValue(0);
  const [dismissedBySwipe, setDismissedBySwipe] = useState(false);
  const onCloseRef = useRef(onClose);
  const detachRef = useRef(detachSharedElement);
  const dragging = useRef(false);
  const locked = useRef(false);
  const finishing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startT = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const widthRef = useRef(390);

  onCloseRef.current = onClose;
  detachRef.current = detachSharedElement;

  const borderRadius = useTransform(x, [0, 72], [0, 20]);
  const swipeFade = useTransform(x, (value) => {
    const width = widthRef.current || 1;
    return 1 - Math.min(Math.max(value, 0) / width, 1);
  });
  const boxShadow = useTransform(x, (value) => {
    const amount = Math.min(value / 24, 1);
    return `-16px 0 40px rgba(0,0,0,${0.5 * amount})`;
  });

  useEffect(() => {
    const onResize = () => {
      widthRef.current = window.innerWidth;
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const previousOverscroll = html.style.overscrollBehaviorX;
    html.style.overscrollBehaviorX = 'none';

    const resetDrag = () => {
      dragging.current = false;
      locked.current = false;
    };

    const onStart = (event: TouchEvent) => {
      if (finishing.current || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (touch.clientX > EVENT_SWIPE_BACK.edgePx) return;

      dragging.current = true;
      locked.current = false;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      startT.current = performance.now();
      lastX.current = touch.clientX;
      lastT.current = startT.current;

      if (!isInteractiveTarget(event.target)) {
        event.preventDefault();
      }
    };

    const onMove = (event: TouchEvent) => {
      if (!dragging.current || finishing.current || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      lastX.current = touch.clientX;
      lastT.current = performance.now();

      if (!locked.current) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          resetDrag();
          x.set(0);
          return;
        }
        if (dx > 8) {
          locked.current = true;
          detachRef.current();
        } else {
          return;
        }
      }

      event.preventDefault();
      x.set(Math.max(0, dx));
    };

    const onEnd = () => {
      if (!dragging.current || finishing.current) return;
      const wasLocked = locked.current;
      resetDrag();
      if (!wasLocked) {
        x.set(0);
        return;
      }

      const width = widthRef.current;
      const offset = x.get();
      const elapsed = Math.max(lastT.current - startT.current, 1);
      const velocity = (lastX.current - startX.current) / elapsed;
      const shouldClose =
        offset / width > EVENT_SWIPE_BACK.threshold || velocity > EVENT_SWIPE_BACK.velocityPxPerMs;

      if (!shouldClose) {
        animate(x, 0, EVENT_SWIPE_BACK.spring);
        return;
      }

      finishing.current = true;
      animate(x, width, {
        ...EVENT_SWIPE_BACK.spring,
        velocity: velocity * 1000,
        onComplete: () => {
          setDismissedBySwipe(true);
          onCloseRef.current();
        },
      });
    };

    document.addEventListener('touchstart', onStart, { passive: false, capture: true });
    document.addEventListener('touchmove', onMove, { passive: false, capture: true });
    document.addEventListener('touchend', onEnd, { capture: true });
    document.addEventListener('touchcancel', onEnd, { capture: true });

    return () => {
      html.style.overscrollBehaviorX = previousOverscroll;
      document.removeEventListener('touchstart', onStart, { capture: true });
      document.removeEventListener('touchmove', onMove, { capture: true });
      document.removeEventListener('touchend', onEnd, { capture: true });
      document.removeEventListener('touchcancel', onEnd, { capture: true });
    };
  }, [x]);

  return { x, borderRadius, boxShadow, swipeFade, dismissedBySwipe };
}
