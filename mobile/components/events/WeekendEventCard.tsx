import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import { formatClock12 } from '@/lib/partyInsider/dates';
import { colors, fonts, MIN_TOUCH, radius, webCursor } from '@/constants/theme';
import { useCardCovered, useEventExpand } from '@/context/EventExpandContext';
import { measureView } from '@/lib/measure';
import { PressableScale } from '@/components/ui/PressableScale';
import { RemoteImage } from '@/components/ui/RemoteImage';

type WeekendEventCardProps = {
  event: EventItem;
  featured?: boolean;
  instanceId?: string;
};

function placeLine(event: EventItem): string {
  if (event.venueAddress) {
    return `${event.city}, ${event.venueAddress}`;
  }
  return event.venue;
}

export function WeekendEventCard({
  event,
  featured = false,
  instanceId: instanceIdProp,
}: WeekendEventCardProps) {
  const instanceId = instanceIdProp ?? `weekend-${event.id}`;
  const covered = useCardCovered(event.id, instanceId);
  const { openEvent } = useEventExpand();
  const ref = useRef<View>(null);
  const ink = featured ? colors.accentFg : colors.fg;
  const meta = featured ? colors.accentFg : colors.muted;
  const rule = featured ? 'rgba(22, 22, 22, 0.28)' : 'rgba(255, 255, 255, 0.18)';

  const onOpen = async () => {
    const rect = await measureView(ref, radius['2xl']);
    openEvent(event.id, instanceId, rect);
  };

  return (
    <View ref={ref} collapsable={false} style={covered ? styles.covered : undefined}>
      <PressableScale
        onPress={onOpen}
        style={webCursor}
        contentStyle={[styles.card, featured ? styles.cardOn : styles.cardOff]}
        accessibilityRole="button"
        accessibilityLabel={`${event.title}, ${event.category}, ${event.time} at ${placeLine(event)}`}
      >
        <View style={styles.top}>
          <RemoteImage uri={event.image} alt="" containerStyle={styles.thumb} />
          <View style={styles.copy}>
            <Text style={[styles.title, { color: ink }]} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={[styles.sub, { color: ink }]} numberOfLines={1}>
              {event.category}
            </Text>
          </View>
        </View>
        <View style={[styles.arrow, featured ? styles.arrowOn : styles.arrowOff]} accessibilityElementsHidden>
          <ArrowUpRight size={16} color={featured ? colors.highlighter : colors.fg} strokeWidth={2.2} />
        </View>
        <View style={styles.meta}>
          <View style={styles.metaBit}>
            <Clock size={13} color={meta} strokeWidth={2} />
            <Text style={[styles.metaText, { color: meta }]}>{formatClock12(event.time)}</Text>
          </View>
          <View style={[styles.metaRule, { backgroundColor: rule }]} />
          <View style={[styles.metaBit, styles.metaPlace]}>
            <MapPin size={13} color={meta} strokeWidth={2} />
            <Text style={[styles.metaText, { color: meta }]} numberOfLines={1}>
              {placeLine(event)}
            </Text>
          </View>
        </View>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  covered: { opacity: 0 },
  card: {
    gap: 12,
    padding: 16,
    paddingRight: 48,
    borderRadius: radius['2xl'],
    minHeight: MIN_TOUCH + 56,
    overflow: 'visible',
  },
  cardOn: {
    backgroundColor: colors.highlighter,
  },
  cardOff: {
    backgroundColor: colors.card,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    justifyContent: 'center',
    minHeight: 56,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  sub: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaBit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  metaPlace: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  metaText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    flexShrink: 1,
  },
  metaRule: {
    width: 1,
    height: 12,
    borderRadius: 1,
  },
  arrow: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowOn: {
    backgroundColor: colors.bg,
  },
  arrowOff: {
    backgroundColor: colors.circle,
  },
});
