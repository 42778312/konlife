import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import { formatMonthDay } from '@/lib/partyInsider/dates';
import { fonts, MIN_TOUCH, radius, webCursor } from '@/constants/theme';
import { useCardCovered, useEventExpand } from '@/context/EventExpandContext';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { measureView } from '@/lib/measure';
import { successTick } from '@/lib/haptics';
import { PressableScale } from '@/components/ui/PressableScale';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { home, PLATE_RADIUS } from '@/components/home/tokens';

function displayPrice(event: EventItem): string {
  const cost = event.price.trim();
  if (cost) return cost;
  return 'Free';
}

type HomeFeaturedCardProps = {
  event: EventItem;
  instanceId?: string;
};

export function HomeFeaturedCard({ event, instanceId = 'home-featured' }: HomeFeaturedCardProps) {
  const { width } = useWindowDimensions();
  const heroH = width < 360 ? 100 : 200;
  const covered = useCardCovered(event.id, instanceId);
  const { openEvent } = useEventExpand();
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(event.id);
  const ref = useRef<View>(null);
  const badge = event.startDate ? formatMonthDay(event.startDate) : null;
  const place = event.venueAddress
    ? `${event.venueAddress}, ${event.city}`
    : `${event.venue}, ${event.city}`;
  const price = displayPrice(event);

  const onOpen = async () => {
    const rect = await measureView(ref, PLATE_RADIUS);
    openEvent(event.id, instanceId, rect);
  };

  return (
    <View ref={ref} collapsable={false} style={[styles.plate, covered && styles.covered]}>
      <View style={[styles.hero, { height: heroH }]}>
        <PressableScale
          onPress={onOpen}
          style={StyleSheet.absoluteFill}
          contentStyle={[styles.heroPress, { height: heroH }]}
          accessibilityLabel={event.title}
        >
          <RemoteImage uri={event.image} alt={event.title} containerStyle={styles.image} />
          {badge ? (
            <View style={[styles.date, { pointerEvents: 'none' }]}>
              <Text style={styles.month}>{badge.month}</Text>
              <Text style={styles.day}>{badge.day}</Text>
            </View>
          ) : null}
        </PressableScale>
        <Pressable
          onPress={() => {
            toggleSaved(event.id);
            successTick();
          }}
          style={[styles.heart, webCursor]}
          accessibilityRole="button"
          accessibilityLabel={saved ? `Unsave ${event.title}` : `Save ${event.title}`}
        >
          <Heart
            size={18}
            color={home.ink}
            fill={saved ? home.lime : 'transparent'}
            strokeWidth={2.2}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.copyRow}>
          <View style={styles.copy}>
            <Text style={styles.title} numberOfLines={1}>
              {event.title}
            </Text>
            <View style={styles.placeRow}>
              <MapPin size={13} color={home.muted} strokeWidth={2.2} />
              <Text style={styles.place} numberOfLines={1}>
                {place}
              </Text>
            </View>
          </View>
          <Text style={styles.price}>{price}</Text>
        </View>

        <View style={styles.foot}>
          <View style={styles.timeMark} accessibilityLabel={`Doors ${event.time}`}>
            <Text style={styles.time}>{event.time}</Text>
          </View>
          <PressableScale
            onPress={onOpen}
            style={styles.ctaHit}
            contentStyle={styles.cta}
            accessibilityRole="button"
            accessibilityLabel={`Open ${event.title}`}
          >
            <Text style={styles.ctaLabel}>Open night</Text>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  covered: { opacity: 0 },
  plate: {
    backgroundColor: home.plate,
    borderRadius: PLATE_RADIUS,
    overflow: 'hidden',
  },
  hero: {
    height: 200,
  },
  heroPress: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  date: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: home.frost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 13,
    color: '#FFFFFF',
  },
  day: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: home.heartDisc,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#FFFFFF',
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  place: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: home.muted,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeMark: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 8,
    borderRadius: 22,
    backgroundColor: home.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    color: home.ink,
  },
  ctaHit: {
    flex: 1,
    minHeight: MIN_TOUCH,
  },
  cta: {
    minHeight: 44,
    borderRadius: radius.full,
    backgroundColor: home.lime,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  ctaLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
    color: home.ink,
  },
});
