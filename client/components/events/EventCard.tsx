import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark } from 'lucide-react-native';
import { EventItem } from '@/data/mockEvents';
import { colors, fonts, MIN_TOUCH, radius, type, webCursor } from '@/constants/theme';
import { useCardCovered, useEventExpand } from '@/context/EventExpandContext';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { measureView } from '@/lib/measure';
import { successTick } from '@/lib/haptics';
import { PressableScale } from '@/components/ui/PressableScale';
import { RemoteImage } from '@/components/ui/RemoteImage';

type EventCardProps = {
  event: EventItem;
  variant?: 'featured' | 'standard' | 'compact' | 'horizontal' | 'list' | 'recommended';
  instanceId?: string;
};

export function EventCard({ event, variant = 'list', instanceId: instanceIdProp }: EventCardProps) {
  const instanceId = instanceIdProp ?? `card-${variant}`;
  const covered = useCardCovered(event.id, instanceId);
  const { openEvent } = useEventExpand();
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(event.id);
  const ref = useRef<View>(null);

  const onOpen = async () => {
    const rect = await measureView(ref, radius.lg);
    openEvent(event.id, instanceId, rect);
  };

  const saveBtn = (
    <Pressable
      onPress={() => {
        toggleSaved(event.id);
        successTick();
      }}
      style={[styles.saveHit, webCursor]}
      accessibilityRole="button"
      accessibilityLabel={saved ? `Unsave ${event.title}` : `Save ${event.title}`}
    >
      <Bookmark
        size={18}
        color={saved ? colors.accentFg : colors.fg}
        fill={saved ? colors.highlighter : 'transparent'}
        strokeWidth={2.2}
      />
    </Pressable>
  );

  if (variant === 'featured') {
    return (
      <View ref={ref} collapsable={false} style={[styles.featuredOuter, covered && styles.covered]}>
        <PressableScale onPress={onOpen} style={styles.featuredPress} contentStyle={styles.featuredInner} accessibilityLabel={event.title}>
          <RemoteImage uri={event.image} alt={event.title} containerStyle={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['transparent', colors.overlay, colors.overlayHeavy]}
            locations={[0.28, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.featuredSave}>{saveBtn}</View>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredWhen}>
              {event.date} · {event.venue}
            </Text>
            <Text style={styles.featuredTitle}>{event.title}</Text>
            <View style={styles.featuredRow}>
              <Text style={styles.tag}>{event.category}</Text>
            <Text style={type.heroPrice}>{event.price || event.venue}</Text>
            </View>
          </View>
        </PressableScale>
      </View>
    );
  }

  if (variant === 'horizontal' || variant === 'recommended') {
    return (
      <View ref={ref} collapsable={false} style={[styles.hOuter, covered && styles.covered]}>
        <PressableScale onPress={onOpen} style={styles.hPress} contentStyle={styles.hInner} accessibilityLabel={event.title}>
          <RemoteImage uri={event.image} alt={event.title} containerStyle={styles.hImage} />
          <View style={styles.hSave}>{saveBtn}</View>
          <View style={styles.hBody}>
            <Text style={styles.hDate}>{event.date}</Text>
            <Text style={styles.hTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.venue} numberOfLines={1}>
              {event.venue}
            </Text>
            {event.price ? <Text style={styles.price}>{event.price}</Text> : null}
          </View>
        </PressableScale>
      </View>
    );
  }

  if (variant === 'standard') {
    return (
      <View ref={ref} collapsable={false} style={[styles.stdOuter, covered && styles.covered]}>
        <PressableScale onPress={onOpen} contentStyle={styles.stdInner} accessibilityLabel={event.title}>
          <RemoteImage uri={event.image} alt={event.title} containerStyle={styles.stdImage} />
          <View style={styles.stdBody}>
            <Text style={styles.hDate}>{event.date}</Text>
            <Text style={type.title} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.venue}>{event.venue}</Text>
            {event.price ? <Text style={styles.price}>{event.price}</Text> : null}
          </View>
        </PressableScale>
      </View>
    );
  }

  if (variant === 'compact') {
    return (
      <View ref={ref} collapsable={false} style={[styles.compactOuter, covered && styles.covered]}>
        <PressableScale
          onPress={onOpen}
          contentStyle={styles.compactInner}
          accessibilityLabel={`${event.title}, ${event.time} at ${event.venue}`}
        >
          <RemoteImage uri={event.image} alt="" containerStyle={styles.compactImage} />
          <View style={styles.copy}>
            <Text style={type.title} numberOfLines={1}>
              {event.title}
            </Text>
            <Text style={styles.venue} numberOfLines={1}>
              {event.time} · {event.venue}
            </Text>
          </View>
        </PressableScale>
      </View>
    );
  }

  return (
    <View ref={ref} collapsable={false} style={[styles.listOuter, covered && styles.covered]}>
      <PressableScale onPress={onOpen} contentStyle={styles.listInner} accessibilityLabel={event.title}>
        <RemoteImage uri={event.image} alt={event.title} containerStyle={styles.listImage} />
          <View style={styles.listBody}>
            {event.date ? <Text style={styles.hDate}>{event.date}</Text> : null}
            <Text style={styles.listTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.venue} numberOfLines={1}>
              {event.venue}
            </Text>
            {event.price ? <Text style={styles.price}>{event.price}</Text> : null}
          </View>
        {saveBtn}
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  covered: { opacity: 0 },
  saveHit: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    borderRadius: radius.full,
  },
  venue: { ...type.meta },
  price: { ...type.label, color: colors.highlighter, marginTop: 4 },
  copy: { flex: 1, minWidth: 0 },
  featuredOuter: { width: '100%', minHeight: 380 },
  featuredPress: { flex: 1, minHeight: 380 },
  featuredInner: {
    minHeight: 380,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  featuredSave: { position: 'absolute', top: 12, right: 12, zIndex: 2 },
  featuredMeta: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, gap: 6 },
  featuredWhen: { ...type.overline, color: colors.highlighter },
  featuredTitle: {
    fontFamily: fonts.displayBlack,
    fontSize: 42,
    lineHeight: 44,
    color: colors.fg,
  },
  featuredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tag: {
    ...type.overline,
    color: colors.fg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  hOuter: { width: 220 },
  hPress: { width: 220 },
  hInner: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  hImage: { height: 168, width: '100%' },
  hSave: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  hBody: { padding: 12, gap: 2, minHeight: 112 },
  hDate: { ...type.overline, color: colors.highlighter },
  hTitle: { ...type.title, marginTop: 2 },
  stdOuter: { flex: 1, minWidth: 240 },
  stdInner: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  stdImage: { height: 180, width: '100%' },
  stdBody: { padding: 14, gap: 4 },
  compactOuter: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.rule,
  },
  compactInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
  },
  compactImage: { width: 64, height: 64, borderRadius: radius.sm },
  listOuter: {},
  listInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    minHeight: 108,
  },
  listImage: { width: 108, alignSelf: 'stretch', minHeight: 108 },
  listBody: { flex: 1, padding: 12, minWidth: 0 },
  listTitle: { ...type.title, marginTop: 2 },
});
