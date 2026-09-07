import React, { useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ExternalLink, MapPin } from 'lucide-react-native';
import { EventItem } from '@/data/mockEvents';
import { colors, radius, space, type, webCursor } from '@/constants/theme';
import { hasCoords, mapsDirectionsUrl } from '@/lib/mapVenues';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type EventDetailBodyProps = {
  event: EventItem;
  /** 'page' sits on the dark screen background (default); 'panel' sits on a card-colored surface, e.g. an inline accordion. */
  surface?: 'page' | 'panel';
};

export function EventDetailBody({ event, surface = 'page' }: EventDetailBodyProps) {
  const tileBg = surface === 'panel' ? colors.paper : colors.card;
  const moreUrl = event.sourceUrl || event.website;
  const address = [event.venueAddress, event.venueZip, event.city].filter(Boolean).join(', ');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onConfirmOpenAddress = () => {
    setConfirmOpen(false);
    if (hasCoords(event)) {
      void Linking.openURL(mapsDirectionsUrl(event.lat, event.lng, event.venue, Platform.OS));
    } else if (moreUrl) {
      void Linking.openURL(moreUrl);
    }
  };

  return (
    <View style={styles.body}>
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
        onPress={() => setConfirmOpen(true)}
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

      <ConfirmDialog
        visible={confirmOpen}
        title="Open in Maps?"
        message={`This opens ${event.venue}${address ? ` (${address})` : ''} in your maps app.`}
        confirmLabel="Open map"
        onConfirm={onConfirmOpenAddress}
        onCancel={() => setConfirmOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: space.lg, gap: space.md },
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
