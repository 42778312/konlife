import React, { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ExternalLink, MapPin, Share2 } from 'lucide-react-native';
import { EventItem } from '@/data/mockEvents';
import { useEvents } from '@/context/EventsProvider';
import { colors, fonts, radius, space, type, webCursor } from '@/constants/theme';
import { successTick } from '@/lib/haptics';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { MapWidget } from '@/components/events/MapWidget';
import { hasCoords } from '@/lib/mapVenues';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { EventCard } from '@/components/events/EventCard';
import { shareNight } from '@/lib/shareNight';

type EventDetailViewProps = {
  event: EventItem;
  onClose?: () => void;
  embedded?: boolean;
};

export function EventDetailView({ event, onClose }: EventDetailViewProps) {
  const insets = useSafeAreaInsets();
  const { isSaved, toggleSaved } = useSavedEvents();
  const { events } = useEvents();
  const saved = isSaved(event.id);
  const related = events
    .filter((e) => e.venue === event.venue && e.id !== event.id && e.title !== event.title)
    .slice(0, 3);
  const moreUrl = event.sourceUrl || event.website;
  const [notice, setNotice] = useState<string | null>(null);
  const shareLock = useRef(false);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2200);
    return () => clearTimeout(timer);
  }, [notice]);

  const onShare = async () => {
    if (shareLock.current) return;
    shareLock.current = true;
    try {
      const result = await shareNight(event);
      if (result === 'copied') {
        successTick();
        setNotice('Link copied');
      } else if (result === 'shared') {
        successTick();
      } else if (result === 'failed') {
        setNotice('Couldn’t copy the link');
      }
    } finally {
      shareLock.current = false;
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ paddingBottom: space['4xl'] + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <RemoteImage uri={event.image} alt={event.title} containerStyle={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(22,22,22,0.35)', 'transparent', colors.overlayHeavy]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
            <IconButton icon={ArrowLeft} variant="surface" size={18} color={colors.fg} accessibilityLabel="Close event" onPress={onClose} />
            <IconButton icon={Share2} variant="surface" size={18} color={colors.fg} accessibilityLabel="Share night" onPress={onShare} />
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.when}>{event.date}</Text>
            <Text style={styles.title} accessibilityRole="header">
              {event.title}
            </Text>
            <Text style={styles.venue}>
              {event.venue} · {event.city}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.actions}>
            <Button
              flex
              label={saved ? 'Saved' : "I'm going"}
              onPress={() => {
                toggleSaved(event.id);
                successTick();
              }}
            />
            <Button flex label="Share" variant="secondary" icon={Share2} onPress={onShare} />
          </View>

          <Text style={type.body}>{event.description}</Text>

          <View style={styles.facts}>
            <Fact label="Time" value={event.time} />
            {event.price ? <Fact label="Door" value={event.price} /> : <Fact label="Place" value={event.venue} />}
            <Fact label="Venue" value={event.venue} />
          </View>

          <View style={styles.tags}>
            {event.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>

          <View style={styles.venueBlock}>
            <MapPin size={16} color={colors.highlighter} strokeWidth={2} />
            <View style={{ flex: 1 }}>
              <Text style={type.title}>{event.venue}</Text>
              <Text style={type.meta}>
                {[event.venueAddress, event.venueZip, event.city].filter(Boolean).join(', ')}
              </Text>
            </View>
          </View>
          {hasCoords(event) ? (
            <View style={styles.map}>
              <MapWidget events={[event]} interactive={false} compact />
            </View>
          ) : null}

          {moreUrl ? (
            <Pressable
              onPress={() => Linking.openURL(moreUrl)}
              style={[styles.linkRow, webCursor]}
              accessibilityRole="link"
              accessibilityLabel="Open event listing"
            >
              <Text style={styles.linkText}>More info</Text>
              <ExternalLink size={14} color={colors.highlighter} strokeWidth={2.2} />
            </Pressable>
          ) : null}

          {related.length > 0 ? (
            <View style={styles.related}>
              <Text style={type.section}>Same venue</Text>
              {related.map((item) => (
                <EventCard key={item.id} event={item} variant="compact" instanceId={`related-${item.id}`} />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
      {notice ? (
        <View style={[styles.toast, { bottom: Math.max(insets.bottom, 12) + 12 }]} accessibilityLiveRegion="polite">
          <Text style={styles.toastText}>{notice}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={type.meta}>{label}</Text>
      <Text style={type.title}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  hero: { width: '100%', height: 420, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
  },
  heroMeta: { padding: space.xl, gap: 6 },
  when: { ...type.overline, color: colors.highlighter },
  title: {
    fontFamily: fonts.displayBlack,
    fontSize: 44,
    lineHeight: 46,
    color: colors.fg,
  },
  venue: { ...type.title, color: colors.subtle },
  body: { padding: space.xl, gap: space.lg },
  actions: { flexDirection: 'row', gap: 12 },
  facts: { flexDirection: 'row', gap: 12 },
  fact: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    gap: 4,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    ...type.overline,
    color: colors.fg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  venueBlock: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  map: { height: 160, borderRadius: radius.md, overflow: 'hidden' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  linkText: { ...type.label, color: colors.highlighter },
  related: { gap: 8, marginTop: 8 },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 20,
    pointerEvents: 'none',
    backgroundColor: colors.highlighter,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  toastText: { ...type.label, color: colors.accentFg },
});
