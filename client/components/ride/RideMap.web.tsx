import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layer, Map, Marker, Source, type MapRef } from '@vis.gl/react-maplibre';
import { colors } from '@/constants/theme';
import { KONSTANZ_CENTER } from '@/lib/mapVenues';
import { RidePin } from '@/components/ride/RidePin';
import type { RideMapProps } from '@/components/ride/rideTypes';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

const stopBubble = (event: Event) => {
  event.stopPropagation();
};

export function RideMap({ origin, destination, path, bottomPad }: RideMapProps) {
  const [map, setMap] = useState<MapRef | null>(null);
  const [ready, setReady] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const geojson = useMemo(() => {
    if (!path || path.length < 2) return null;
    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: path.map((point) => [point.longitude, point.latitude]),
          },
        },
      ],
    };
  }, [path]);

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
    const pad = {
      top: 48,
      left: 32,
      right: 32,
      bottom: Math.max(bottomPad, 180) + 24,
    };
    if (path && path.length >= 2) {
      const lats = path.map((p) => p.latitude);
      const lngs = path.map((p) => p.longitude);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: pad, duration: 280, maxZoom: 16 },
      );
      return;
    }
    if (origin && destination) {
      map.fitBounds(
        [
          [Math.min(origin.lng, destination.lng), Math.min(origin.lat, destination.lat)],
          [Math.max(origin.lng, destination.lng), Math.max(origin.lat, destination.lat)],
        ],
        { padding: pad, duration: 280, maxZoom: 16 },
      );
      return;
    }
    const focus = origin ?? destination;
    if (focus) {
      map.easeTo({ center: [focus.lng, focus.lat], zoom: 14, duration: 280, padding: pad });
      return;
    }
    map.easeTo({
      center: [KONSTANZ_CENTER.longitude, KONSTANZ_CENTER.latitude],
      zoom: 13,
      duration: 280,
    });
  }, [bottomPad, destination, map, origin, path]);

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
        }}
        style={canvasStyle}
        attributionControl={{ compact: true }}
        cooperativeGestures={false}
        dragRotate={false}
        touchPitch={false}
        cursor="grab"
      >
        {geojson ? (
          <Source id="ride-path" type="geojson" data={geojson}>
            <Layer
              id="ride-path-case"
              type="line"
              paint={{
                'line-color': '#000000',
                'line-width': 7,
                'line-opacity': 0.45,
              }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
            <Layer
              id="ride-path-line"
              type="line"
              paint={{
                'line-color': colors.highlighter,
                'line-width': 4,
                'line-opacity': 1,
              }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
          </Source>
        ) : null}
        {origin ? (
          <Marker longitude={origin.lng} latitude={origin.lat} anchor="center" style={{ zIndex: 2 }}>
            <RidePin kind="origin" />
          </Marker>
        ) : null}
        {destination ? (
          <Marker longitude={destination.lng} latitude={destination.lat} anchor="center" style={{ zIndex: 2 }}>
            <RidePin kind="destination" />
          </Marker>
        ) : null}
      </Map>
    </div>
  );
}

const shellStyle = { position: 'absolute', inset: 0, touchAction: 'none' } as const;
const canvasStyle = { width: '100%', height: '100%' } as const;

const styles = StyleSheet.create({
  boot: { backgroundColor: colors.paper },
});
