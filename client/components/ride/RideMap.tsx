import React, { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { colors } from '@/constants/theme';
import { KONSTANZ_CENTER, KONSTANZ_REGION } from '@/lib/mapVenues';
import { RidePin } from '@/components/ride/RidePin';
import type { RideMapProps } from '@/components/ride/rideTypes';

const ANDROID_NIGHT = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8E8E93' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#161616' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8E8E93' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
];

export function RideMap({ origin, destination, path, bottomPad }: RideMapProps) {
  const mapRef = useRef<MapView>(null);
  const coords = useMemo(() => {
    if (path && path.length >= 2) return path;
    const pins = [];
    if (origin) pins.push({ latitude: origin.lat, longitude: origin.lng });
    if (destination) pins.push({ latitude: destination.lat, longitude: destination.lng });
    return pins;
  }, [destination, origin, path]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (coords.length >= 2) {
      map.fitToCoordinates(coords, {
        edgePadding: {
          top: 48,
          right: 32,
          bottom: Math.max(bottomPad, 180) + 24,
          left: 32,
        },
        animated: true,
      });
      return;
    }
    if (coords.length === 1) {
      map.animateToRegion(
        {
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        },
        280,
      );
      return;
    }
    map.animateToRegion(
      {
        ...KONSTANZ_REGION,
        latitude: KONSTANZ_CENTER.latitude,
        longitude: KONSTANZ_CENTER.longitude,
      },
      280,
    );
  }, [bottomPad, coords]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={KONSTANZ_REGION}
      userInterfaceStyle="dark"
      mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
      customMapStyle={Platform.OS === 'android' ? ANDROID_NIGHT : undefined}
      pitchEnabled={false}
      rotateEnabled={false}
      toolbarEnabled={false}
      showsCompass={false}
      showsPointsOfInterests={false}
      showsBuildings={false}
      moveOnMarkerPress={false}
    >
      {path && path.length >= 2 ? (
        <Polyline coordinates={path} strokeColor={colors.highlighter} strokeWidth={4} />
      ) : null}
      {origin ? (
        <Marker
          coordinate={{ latitude: origin.lat, longitude: origin.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        >
          <RidePin kind="origin" />
        </Marker>
      ) : null}
      {destination ? (
        <Marker
          coordinate={{ latitude: destination.lat, longitude: destination.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        >
          <RidePin kind="destination" />
        </Marker>
      ) : null}
    </MapView>
  );
}
