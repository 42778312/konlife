import React, { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ExternalLink, MapPin, Share2 } from 'lucide-react-native';
import { EventItem } from '@/data/mockEvents';
import { colors, radius, space, type, webCursor } from '@/constants/theme';
import { successTick } from '@/lib/haptics';
import { useSavedEvents } from '@/context/SavedEventsProvider';
import { hasCoords, mapsDirectionsUrl } from '@/lib/mapVenues';
import { Button } from '@/components/ui/Button';
import { shareNight } from '@/lib/shareNight';

type EventDetailBodyProps = {
  event: EventItem;
  /** 'page' sits on the dark screen background (default); 'panel' sits on a card-colored surface, e.g. an inline accordion. */
  surface?: 'page' | 'panel';
};

export function EventDetailBody({ event, surface = 'page' }: EventDetailBodyProps) {
  const tileBg = surface === 'panel' ? colors.paper : colors.card;
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(event.id);
  const moreUrl = event.sourceUrl || event.website;
  const address = [event.venueAddress, event.venueZip, event.city].filter(Boolean).join(', ');
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

  const onOpenAddress = () => {
    if (hasCoords(event)) {
      void Linking.openURL(mapsDirectionsUrl(event.lat, event.lng, event.venue));
    } else if (moreUrl) {
      void Linking.openURL(moreUrl);
    }
  };

  return (
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

      {notice ? <Text style={styles.notice}>{notice}</Text> : null}

      <View style={styles.facts}>
        <Fact label="Time" value={event.time} background={tileBg} />
        {event.price ? (
          <Fact label="Door" value={event.price} background={tileBg} />
        ) : (
          <Fact label="Place" value={event.venue} background={tileBg} />
        )}
        <Fact label="Venue" value={event.venue} background={tileBg} />
      </View>

      {event.tags.length > 0 ? (
        <View style={styles.tags}>
          {event.tags.map((tag) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      ) : null}

      <Pressable
        onPress={onOpenAddress}
        style={[styles.venueBlock, { backgroundColor: tileBg }, webCursor]}
        accessibilityRole="button"
        accessibilityLabel={`Open map for ${event.venue}`}
      >
        <MapPin size={16} color={colors.highlighter} strokeWidth={2} />
        <View style={{ flex: 1 }}>
          <Text style={type.title}>{event.venue}</Text>
          {address ? <Text style={type.meta}>{address}</Text> : null}
        </View>
        <ExternalLink size={14} color={colors.highlighter} strokeWidth={2.2} />
      </Pressable>

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
    </View>
  );
}

function Fact({ label, value, background }: { label: string; value: string; background: string }) {
  return (
    <View style={[styles.fact, { backgroundColor: background }]}>
      <Text style={type.meta}>{label}</Text>
      <Text style={type.title}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: space.lg, gap: space.md },
  actions: { flexDirection: 'row', gap: 12 },
  notice: { ...type.meta, color: colors.highlighter },
  facts: { flexDirection: 'row', gap: 12 },
  fact: {
    flex: 1,
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
  venueBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 44,
    borderRadius: radius.md,
    padding: 12,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  linkText: { ...type.label, color: colors.highlighter },
});
