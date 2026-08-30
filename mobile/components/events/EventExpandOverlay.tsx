import React, { useEffect } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { EventDetailView } from '@/components/events/EventDetailView';
import { colors } from '@/constants/theme';
import {
  EVENT_EXPAND_SPRING,
  EVENT_OVERLAY_FADE_MS,
  EVENT_SWIPE_BACK,
  type SourceRect,
} from '@/lib/eventMotion';

type EventExpandOverlayProps = {
  eventId: string;
  instanceId: string;
  rect?: SourceRect | null;
  onClose: () => void;
};

export function EventExpandOverlay({ eventId, rect, onClose }: EventExpandOverlayProps) {
  const event = MOCK_EVENTS.find((item) => item.id === eventId) || MOCK_EVENTS[0];
  const { width: sw, height: sh } = useWindowDimensions();
  const hasRect = Boolean(rect && rect.width > 0 && rect.height > 0);

  const progress = useSharedValue(hasRect ? 0 : 1);
  const translateX = useSharedValue(0);
  const backdrop = useSharedValue(hasRect ? 0 : 1);

  useEffect(() => {
    progress.value = withSpring(1, EVENT_EXPAND_SPRING);
    backdrop.value = withTiming(1, { duration: EVENT_OVERLAY_FADE_MS });
  }, [backdrop, progress]);

  const dismiss = (bySwipe: boolean) => {
    if (bySwipe) {
      onClose();
      return;
    }
    backdrop.value = withTiming(0, { duration: EVENT_OVERLAY_FADE_MS });
    progress.value = withSpring(0, EVENT_EXPAND_SPRING, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const requestClose = () => dismiss(false);

  const pan = Gesture.Pan()
    .activeOffsetX(8)
    .failOffsetY([-16, 16])
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd((e) => {
      const shouldClose =
        translateX.value / sw > EVENT_SWIPE_BACK.threshold || e.velocityX > EVENT_SWIPE_BACK.velocityPxPerS;
      if (!shouldClose) {
        translateX.value = withSpring(0, EVENT_SWIPE_BACK.spring);
        return;
      }
      translateX.value = withSpring(
        sw,
        { ...EVENT_SWIPE_BACK.spring, velocity: e.velocityX },
        (finished) => {
          if (finished) runOnJS(dismiss)(true);
        },
      );
    });

  const backdropStyle = useAnimatedStyle(() => {
    const swipeFade = 1 - Math.min(Math.max(translateX.value, 0) / sw, 1);
    return { opacity: backdrop.value * swipeFade };
  });

  const panelStyle = useAnimatedStyle(() => {
    const r = rect;
    const p = progress.value;
    const left = hasRect && r ? interpolate(p, [0, 1], [r.x, 0]) : 0;
    const top = hasRect && r ? interpolate(p, [0, 1], [r.y, 0]) : 0;
    const width = hasRect && r ? interpolate(p, [0, 1], [r.width, sw]) : sw;
    const height = hasRect && r ? interpolate(p, [0, 1], [r.height, sh]) : sh;
    const radius = hasRect && r ? interpolate(p, [0, 1], [r.radius, 0]) : 0;
    const amount = Math.min(translateX.value / 24, 1);

    return {
      position: 'absolute' as const,
      left,
      top,
      width,
      height,
      borderRadius: radius,
      overflow: 'hidden' as const,
      backgroundColor: colors.bg,
      transform: [{ translateX: translateX.value }],
      boxShadow: `${-16 * amount}px 0px 40px rgba(0,0,0,${0.5 * amount})`,
    };
  });

  return (
    <View style={styles.host}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} accessibilityLabel="Dismiss event" />
      </Animated.View>

      <Animated.View style={panelStyle}>
        <View style={styles.panelFill}>
          <EventDetailView event={event} onClose={requestClose} embedded />
        </View>
        <GestureDetector gesture={pan}>
          <View style={styles.edge} />
        </GestureDetector>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFill,
    zIndex: 80,
    pointerEvents: 'box-none',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  panelFill: {
    flex: 1,
  },
  edge: {
    position: 'absolute',
    left: 0,
    top: 56,
    bottom: 0,
    width: EVENT_SWIPE_BACK.edgePx,
    zIndex: 40,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },
});
