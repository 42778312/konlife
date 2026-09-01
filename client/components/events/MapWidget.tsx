import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import type { EventItem } from '@/data/mockEvents';
import { colors, radius, webCursor } from '@/constants/theme';
import { groupEventsByVenue } from '@/lib/mapVenues';
import { MapCanvas } from '@/components/events/MapCanvas';
import { VenueSelectPlate } from '@/components/events/VenueSelectPlate';
import { selectionTick } from '@/lib/haptics';

type MapWidgetProps = {
  events: EventItem[];
  interactive?: boolean;
  compact?: boolean;
  onSelectEvent?: (event: EventItem) => void;
};

function mapsDirectionsUrl(lat: number, lng: number, label: string): string {
  const q = encodeURIComponent(label);
  if (Platform.OS === 'ios') return `maps://?ll=${lat},${lng}&q=${q}`;
  if (Platform.OS === 'android') return `geo:${lat},${lng}?q=${lat},${lng}(${q})`;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function MapWidget({
  events,
  interactive = true,
  compact = false,
  onSelectEvent,
}: MapWidgetProps) {
  const pins = useMemo(() => groupEventsByVenue(events), [events]);
  const [selectedId, setSelectedId] = useState<string | null>(compact ? (pins[0]?.id ?? null) : null);
  const selectedPin = pins.find((pin) => pin.id === selectedId) ?? null;
  const canSelect = interactive && !compact;

  useEffect(() => {
    if (compact) {
      setSelectedId(pins[0]?.id ?? null);
      return;
    }
    setSelectedId((current) => (current && pins.some((pin) => pin.id === current) ? current : null));
  }, [compact, pins]);

  const onSelectPin = (id: string | null) => {
    if (!canSelect) return;
    selectionTick();
    setSelectedId(id);
  };

  const openDirections = () => {
    const pin = pins[0];
    if (!pin) return;
    void Linking.openURL(mapsDirectionsUrl(pin.lat, pin.lng, pin.venue));
  };

  return (
    <View
      style={[styles.canvas, compact && styles.compact]}
      accessibilityLabel={compact ? `Map of ${pins[0]?.venue ?? 'Konstanz'}` : 'Map of Konstanz nights'}
    >
      <MapCanvas
        pins={pins}
        selectedId={selectedId}
        interactive={interactive}
        compact={compact}
        onSelectPin={onSelectPin}
      />
      {canSelect && selectedPin ? (
        <VenueSelectPlate pin={selectedPin} onSelectEvent={onSelectEvent} />
      ) : null}
      {compact && pins.length > 0 ? (
        <Pressable
          onPress={openDirections}
          style={[StyleSheet.absoluteFill, webCursor]}
          accessibilityRole="link"
          accessibilityLabel={`Open directions to ${pins[0].venue}`}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    width: '100%',
    minHeight: 160,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  compact: {
    borderRadius: radius.md,
    minHeight: 0,
  },
});
