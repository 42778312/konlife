import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { EventItem } from '@/data/mockEvents';
import { colors, radius, space, type, webCursor } from '@/constants/theme';
import { useEventExpand } from '@/context/EventExpandContext';
import { measureView } from '@/lib/measure';
import { selectionTick } from '@/lib/haptics';
import { RemoteImage } from '@/components/ui/RemoteImage';

const AUTO_MS = 4800;
const RESUME_MS = 6000;
const HERO_HEIGHT = 340;
const HERO_RADIUS = radius.xl;
const INSTANCE_ID = 'hero-slideshow';
const SCREEN_GUTTER = 32;

type HeroSlideshowProps = {
  events: EventItem[];
};

export function HeroSlideshow({ events }: HeroSlideshowProps) {
  const { width: windowWidth } = useWindowDimensions();
  const { openEvent, source } = useEventExpand();
  const covered = source?.instanceId === INSTANCE_ID;
  const hostRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const userPausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);

  const slideWidth = measuredWidth || Math.max(windowWidth - SCREEN_GUTTER, 0);
  const autoplay = !covered && !userPaused && events.length > 1 && slideWidth > 0;

  const setSlide = useCallback(
    (next: number, animated: boolean) => {
      if (!events.length || slideWidth <= 0) return;
      const clamped = ((next % events.length) + events.length) % events.length;
      const wrapAround = indexRef.current === events.length - 1 && clamped === 0;
      scrollRef.current?.scrollTo({ x: clamped * slideWidth, animated: animated && !wrapAround });
      indexRef.current = clamped;
      setIndex(clamped);
    },
    [events.length, slideWidth],
  );

  const pauseForUser = useCallback(() => {
    userPausedRef.current = true;
    setUserPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      userPausedRef.current = false;
      setUserPaused(false);
    }, RESUME_MS);
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (slideWidth <= 0) return;
    scrollRef.current?.scrollTo({ x: indexRef.current * slideWidth, animated: false });
  }, [slideWidth]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      if (userPausedRef.current) return;
      setSlide(indexRef.current + 1, true);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [autoplay, setSlide]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (slideWidth <= 0) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
    if (next === indexRef.current || next < 0 || next >= events.length) return;
    indexRef.current = next;
    setIndex(next);
  };

  const onOpen = async (event: EventItem) => {
    const rect = await measureView(hostRef, HERO_RADIUS);
    openEvent(event.id, INSTANCE_ID, rect);
  };

  const goTo = (next: number) => {
    pauseForUser();
    selectionTick();
    setSlide(next, true);
  };

  if (!events.length) return null;

  return (
    <View
      ref={hostRef}
      collapsable={false}
      onLayout={(e) => {
        const next = Math.round(e.nativeEvent.layout.width);
        if (next && next !== measuredWidth) setMeasuredWidth(next);
      }}
      style={[styles.outer, covered && styles.covered]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        directionalLockEnabled
        disableIntervalMomentum
        snapToInterval={slideWidth || undefined}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onScrollBeginDrag={pauseForUser}
        onTouchStart={pauseForUser}
        style={styles.pager}
      >
        {events.map((event) => (
          <Pressable
            key={event.id}
            onPress={() => onOpen(event)}
            accessibilityRole="button"
            accessibilityLabel={`${event.title}. What's new this weekend.`}
            style={[styles.slide, { width: slideWidth }, webCursor]}
          >
            <RemoteImage uri={event.image} alt={event.title} containerStyle={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.92)']}
              locations={[0.22, 0.58, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.meta}>
              <Text style={styles.title} numberOfLines={2}>
                {event.title}
              </Text>
              <Text style={styles.venue}>{event.venue}</Text>
              <Text style={styles.date}>{event.date}</Text>
              <View style={styles.row}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagPillText}>{event.tags.join(' · ')}</Text>
                </View>
                <Text style={type.heroPrice}>{event.price}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.chrome}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeTitle}>This weekend</Text>
          </View>
          {events.length > 1 ? (
            <View style={styles.dots}>
              {events.map((event, i) => (
                <Dot
                  key={event.id}
                  active={i === index}
                  onPress={() => goTo(i)}
                  label={`Show ${event.title}`}
                />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function Dot({
  active,
  onPress,
  label,
}: {
  active: boolean;
  onPress: () => void;
  label: string;
}) {
  const w = useSharedValue(active ? 18 : 7);
  useEffect(() => {
    w.value = withTiming(active ? 18 : 7, { duration: 220 });
  }, [active, w]);
  const style = useAnimatedStyle(() => ({ width: w.value }));

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[styles.dotHit, webCursor]}
    >
      <Animated.View style={[styles.dot, active ? styles.dotActive : styles.dotIdle, style]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    height: HERO_HEIGHT,
    borderRadius: HERO_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.zinc900,
  },
  covered: {
    opacity: 0,
  },
  pager: {
    flex: 1,
  },
  slide: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  meta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.xl,
    pointerEvents: 'none',
  },
  title: {
    ...type.display,
    color: colors.white,
    marginBottom: 2,
  },
  venue: {
    ...type.label,
    color: colors.subtle,
    marginBottom: 2,
  },
  date: {
    ...type.meta,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  tagPill: {
    backgroundColor: 'rgba(8, 8, 9, 0.55)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    maxWidth: '62%',
  },
  tagPillText: {
    ...type.meta,
    color: colors.subtle,
  },
  chrome: {
    ...StyleSheet.absoluteFill,
    padding: 14,
    pointerEvents: 'box-none',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    pointerEvents: 'box-none',
  },
  badge: {
    pointerEvents: 'none',
    backgroundColor: colors.overlay,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  badgeTitle: {
    ...type.label,
    color: colors.white,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.overlay,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  dotHit: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 7,
    borderRadius: 99,
  },
  dotIdle: {
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
  },
  dotActive: {
    backgroundColor: colors.neon,
  },
});
