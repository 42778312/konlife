import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Check, Share2 } from 'lucide-react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { EventItem } from '@/data/mockEvents';
import { colors, fonts, radius, type } from '@/constants/theme';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { successTick } from '@/lib/haptics';
import { ticketPath } from '@/lib/ticketPath';
import { shareNight } from '@/lib/shareNight';
import { RemoteImage } from '@/components/ui/RemoteImage';

type TicketEventCardProps = {
  event: EventItem;
  expanded?: boolean;
  onPress: () => void;
};

const CARD_HEIGHT = 132;
const STUB_WIDTH = 68;
const NOTCH_RADIUS = 10;
const CORNER_RADIUS = radius.lg;
const SWIPE_CONFIRM = 96;

export function TicketEventCard({ event, expanded = false, onPress }: TicketEventCardProps) {
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(event.id);
  const [width, setWidth] = useState(0);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const translateX = useSharedValue(0);
  const bump = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const shareLock = useRef(false);

  const onLayoutCard = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const confirmGoing = () => {
    if (!saved) {
      toggleSaved(event.id);
      successTick();
      bump.value = withSequence(withSpring(1.35, { damping: 8, stiffness: 260 }), withSpring(1));
    }
  };

  const onShare = async () => {
    if (shareLock.current) return;
    shareLock.current = true;
    try {
      const result = await shareNight(event);
      if (result === 'copied') {
        successTick();
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 1600);
      } else if (result === 'shared') {
        successTick();
      } else if (result === 'failed') {
        setShareStatus('failed');
        setTimeout(() => setShareStatus('idle'), 1600);
      }
    } finally {
      shareLock.current = false;
    }
  };

  const tap = Gesture.Tap()
    .maxDistance(10)
    .onBegin(() => {
      pressScale.value = withTiming(0.97, { duration: 80 });
    })
    .onFinalize(() => {
      pressScale.value = withTiming(1, { duration: 120 });
    })
    .onEnd((e, success) => {
      if (!success) return;
      if (width > 0 && e.x > width - STUB_WIDTH) {
        runOnJS(onShare)();
      } else {
        runOnJS(onPress)();
      }
    });

  const pan = Gesture.Pan()
    .activeOffsetX(14)
    .failOffsetY([-12, 12])
    .onUpdate((e) => {
      translateX.value = Math.max(0, Math.min(e.translationX, SWIPE_CONFIRM * 1.4));
    })
    .onEnd((e) => {
      const shouldConfirm = translateX.value > SWIPE_CONFIRM || e.velocityX > 700;
      translateX.value = withSpring(0, { damping: 22, stiffness: 260 });
      if (shouldConfirm) runOnJS(confirmGoing)();
    });

  const composed = Gesture.Exclusive(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: pressScale.value }],
  }));

  const revealStyle = useAnimatedStyle(() => ({
    opacity: Math.min(translateX.value / (SWIPE_CONFIRM * 0.6), 1),
  }));

  const bumpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bump.value }],
  }));

  const notchX = width > 0 ? width - STUB_WIDTH : 0;
  const path =
    width > 0
      ? ticketPath(
          width,
          CARD_HEIGHT,
          notchX,
          NOTCH_RADIUS,
          {
            topLeft: CORNER_RADIUS,
            topRight: CORNER_RADIUS,
            bottomLeft: expanded ? 0 : CORNER_RADIUS,
            bottomRight: expanded ? 0 : CORNER_RADIUS,
          },
          !expanded,
        )
      : null;

  return (
    <View style={styles.outer}>
      <Animated.View style={[styles.reveal, revealStyle, styles.noPointerEvents]}>
        <Animated.View style={bumpStyle}>
          <Check size={20} color={colors.accentFg} strokeWidth={2.6} />
        </Animated.View>
        <Text style={styles.revealText}>Going!</Text>
      </Animated.View>

      <GestureDetector gesture={composed}>
        <Animated.View style={cardStyle} onLayout={onLayoutCard} accessibilityLabel={event.title}>
          <View style={styles.base}>
            {path ? (
              <Svg width={width} height={CARD_HEIGHT} style={StyleSheet.absoluteFill}>
                <Path d={path} fill={colors.card} />
              </Svg>
            ) : null}

            <View style={styles.content}>
              <RemoteImage uri={event.image} alt={event.title} containerStyle={styles.image} />
              <View style={styles.body}>
                {event.date ? <Text style={styles.date}>{event.date}</Text> : null}
                <Text style={styles.title} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={styles.venue} numberOfLines={1}>
                  {event.venue}
                </Text>
                {event.price ? <Text style={styles.price}>{event.price}</Text> : null}
              </View>
              <View style={styles.stubSpacer} />
            </View>

            {width > 0 ? (
              <View style={[styles.divider, { left: notchX }, styles.noPointerEvents]} />
            ) : null}

            <View style={[styles.stub, styles.noPointerEvents]}>
              <Share2 size={18} color={colors.fg} strokeWidth={2.2} />
              <Text style={styles.stubLabel}>
                {shareStatus === 'copied' ? 'Copied' : shareStatus === 'failed' ? 'Try again' : 'Share'}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { position: 'relative' },
  noPointerEvents: { pointerEvents: 'none' },
  reveal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: CORNER_RADIUS,
    backgroundColor: colors.highlighter,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 20,
  },
  revealText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.accentFg,
  },
  base: {
    minHeight: CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  image: {
    width: 110,
    alignSelf: 'stretch',
    minHeight: CARD_HEIGHT,
    overflow: 'hidden',
    borderTopLeftRadius: CORNER_RADIUS,
    borderBottomLeftRadius: CORNER_RADIUS,
  },
  body: { flex: 1, padding: 12, minWidth: 0, gap: 2 },
  date: { ...type.overline, color: colors.highlighter },
  title: { ...type.title, marginTop: 2 },
  venue: { ...type.meta },
  price: { ...type.label, color: colors.highlighter, marginTop: 4 },
  stubSpacer: { width: STUB_WIDTH },
  divider: {
    position: 'absolute',
    top: NOTCH_RADIUS,
    bottom: NOTCH_RADIUS,
    width: 0,
    borderLeftWidth: 3,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.22)',
  },
  stub: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: STUB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  stubLabel: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.2,
    color: colors.muted,
  },
});
