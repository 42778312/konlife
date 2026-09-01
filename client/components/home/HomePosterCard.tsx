import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import { formatMonthDay } from '@/lib/partyInsider/dates';
import { fonts, webCursor } from '@/constants/theme';
import { useCardCovered, useEventExpand } from '@/context/EventExpandContext';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { measureView } from '@/lib/measure';
import { successTick } from '@/lib/haptics';
import { PressableScale } from '@/components/ui/PressableScale';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { home, POSTER_H, POSTER_W } from '@/components/home/tokens';

const POSTER_R = 22;

type HomePosterCardProps = {
  event: EventItem;
  instanceId?: string;
};

export function HomePosterCard({ event, instanceId = 'home-poster' }: HomePosterCardProps) {
  const covered = useCardCovered(event.id, instanceId);
  const { openEvent } = useEventExpand();
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(event.id);
  const ref = useRef<View>(null);
  const badge = event.startDate ? formatMonthDay(event.startDate) : null;

  const onOpen = async () => {
    const rect = await measureView(ref, POSTER_R);
    openEvent(event.id, instanceId, rect);
  };

  return (
    <View ref={ref} collapsable={false} style={[styles.outer, covered && styles.covered]}>
      <PressableScale onPress={onOpen} accessibilityLabel={event.title} style={styles.press} contentStyle={styles.card}>
        <RemoteImage uri={event.image} alt={event.title} containerStyle={styles.image} />
        {badge ? (
          <View style={[styles.date, { pointerEvents: 'none' }]}>
            <Text style={styles.dateText}>
              {badge.day} {badge.month}
            </Text>
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
            size={16}
            color={home.ink}
            fill={saved ? home.lime : 'transparent'}
            strokeWidth={2.2}
          />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  covered: { opacity: 0 },
  outer: { width: POSTER_W, height: POSTER_H, position: 'relative' },
  press: { width: POSTER_W, height: POSTER_H },
  card: {
    width: POSTER_W,
    height: POSTER_H,
    borderRadius: POSTER_R,
    overflow: 'hidden',
    backgroundColor: home.plate,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  date: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: home.lime,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    color: home.ink,
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: home.heartDisc,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
