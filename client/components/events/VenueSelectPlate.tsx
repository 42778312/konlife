import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import type { VenuePin } from '@/lib/mapVenues';
import { colors, MIN_TOUCH, radius, space, type, webCursor } from '@/constants/theme';
import { PressableScale } from '@/components/ui/PressableScale';
import { RemoteImage } from '@/components/ui/RemoteImage';

type VenueSelectPlateProps = {
  pin: VenuePin;
  onSelectEvent?: (event: EventItem) => void;
};

export function VenueSelectPlate({ pin, onSelectEvent }: VenueSelectPlateProps) {
  const lead = pin.events[0];
  if (!lead) return null;

  if (pin.events.length === 1) {
    return (
      <PressableScale
        onPress={() => onSelectEvent?.(lead)}
        style={styles.plate}
        contentStyle={styles.row}
        accessibilityRole="button"
        accessibilityLabel={`Open ${lead.title} at ${pin.venue}`}
      >
        <RemoteImage uri={lead.image} alt="" containerStyle={styles.thumb} />
        <View style={styles.copy}>
          <Text style={styles.kicker} numberOfLines={1}>
            {lead.date} · {lead.time}
          </Text>
          <Text style={type.title} numberOfLines={1}>
            {lead.title}
          </Text>
          <Text style={type.meta} numberOfLines={1}>
            {pin.venue}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.muted} strokeWidth={2.2} />
      </PressableScale>
    );
  }

  return (
    <View style={styles.plate} accessibilityRole="summary">
      <Text style={styles.venueHead} numberOfLines={1}>
        {pin.venue}
      </Text>
      {pin.events.slice(0, 4).map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onSelectEvent?.(item)}
          style={[styles.nightRow, webCursor]}
          accessibilityRole="button"
          accessibilityLabel={`Open ${item.title}`}
        >
          <View style={styles.copy}>
            <Text style={type.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={type.meta} numberOfLines={1}>
              {item.date} · {item.time}
            </Text>
          </View>
          <ChevronRight size={16} color={colors.muted} strokeWidth={2.2} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    position: 'absolute',
    left: space.md,
    right: space.md,
    bottom: space.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space.md,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  kicker: {
    ...type.overline,
    color: colors.highlighter,
  },
  venueHead: {
    ...type.label,
    marginBottom: 4,
  },
  nightRow: {
    minHeight: MIN_TOUCH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
