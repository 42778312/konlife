import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Map, Marker, type MapRef } from '@vis.gl/react-maplibre';
import { colors } from '@/constants/theme';
import { KONSTANZ_CENTER, regionForPins } from '@/lib/mapVenues';
import { EventMapPin } from '@/components/events/EventMapPin';
import type { MapCanvasProps } from '@/components/events/mapTypes';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

const stopBubble = (event: Event) => {
  event.stopPropagation();
};

export function MapCanvas({ pins, selectedId, interactive, compact, onSelectPin }: MapCanvasProps) {
  const [map, setMap] = useState<MapRef | null>(null);
  const [ready, setReady] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const region = useMemo(() => regionForPins(pins), [pins]);
  const canMove = interactive && !compact;
  const bounds = useMemo(() => {
    if (pins.length < 2) return undefined;
    const lats = pins.map((pin) => pin.lat);
    const lngs = pins.map((pin) => pin.lng);
    return [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ] as [[number, number], [number, number]];
  }, [pins]);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const types = ['touchstart', 'touchmove', 'touchend', 'touchcancel'] as const;
    for (const type of types) shell.addEventListener(type, stopBubble);
    return () => {
      for (const type of types) shell.removeEventListener(type, stopBubble);
    };
  }, [ready]);

  useEffect(() => {
    if (!map) return;
    if (pins.length === 0) {
      map.easeTo({
        center: [KONSTANZ_CENTER.longitude, KONSTANZ_CENTER.latitude],
        zoom: 13,
        duration: 280,
      });
      return;
    }
    if (pins.length === 1) {
      map.easeTo({
        center: [region.longitude, region.latitude],
        zoom: compact ? 15 : 14,
        duration: 280,
      });
      return;
    }
    map.fitBounds(
      [
        [region.longitude - region.longitudeDelta / 2, region.latitude - region.latitudeDelta / 2],
        [region.longitude + region.longitudeDelta / 2, region.latitude + region.latitudeDelta / 2],
      ],
      { padding: compact ? 28 : 56, duration: 280, maxZoom: 15 },
    );
  }, [compact, map, pins.length, region]);

  if (!ready) {
    return <View style={[StyleSheet.absoluteFill, styles.boot]} />;
  }

  return (
    <div ref={shellRef} style={shellStyle}>
      <Map
        ref={setMap}
        mapStyle={STYLE_URL}
        initialViewState={{
          longitude: KONSTANZ_CENTER.longitude,
          latitude: KONSTANZ_CENTER.latitude,
          zoom: 13,
          bounds,
          fitBoundsOptions: pins.length > 1 ? { padding: 56, maxZoom: 15 } : undefined,
        }}
        style={canvasStyle}
        attributionControl={{ compact: true }}
        cooperativeGestures={false}
        dragPan={canMove}
        dragRotate={false}
        scrollZoom={canMove}
        doubleClickZoom={canMove}
        touchZoomRotate={canMove}
        touchPitch={false}
        keyboard={canMove}
        cursor={canMove ? 'grab' : 'default'}
        onClick={() => {
          if (canMove) onSelectPin(null);
        }}
      >
        {pins.map((pin) => {
          const selected = pin.id === selectedId;
          return (
            <Marker
              key={pin.id}
              longitude={pin.lng}
              latitude={pin.lat}
              anchor="bottom"
              style={{ cursor: canMove ? 'pointer' : 'default', zIndex: selected ? 2 : 1 }}
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                if (canMove) onSelectPin(pin.id);
              }}
            >
              <EventMapPin selected={selected} count={pin.events.length} />
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}

const shellStyle = { position: 'absolute', inset: 0, touchAction: 'none' } as const;
const canvasStyle = { width: '100%', height: '100%' } as const;

const styles = StyleSheet.create({
  boot: { backgroundColor: colors.paper },
});
