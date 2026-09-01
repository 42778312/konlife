import React, { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { KONSTANZ_REGION, regionForPins } from '@/lib/mapVenues';
import { EventMapPin } from '@/components/events/EventMapPin';
import type { MapCanvasProps } from '@/components/events/mapTypes';

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

export function MapCanvas({ pins, selectedId, interactive, compact, onSelectPin }: MapCanvasProps) {
  const mapRef = useRef<MapView>(null);
  const tappingMarker = useRef(false);
  const region = useMemo(() => regionForPins(pins) as Region, [pins]);
  const canMove = interactive && !compact;

  useEffect(() => {
    mapRef.current?.animateToRegion(region, 280);
  }, [region]);

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
      scrollEnabled={canMove}
      zoomEnabled={canMove}
      toolbarEnabled={false}
      showsCompass={false}
      showsPointsOfInterests={false}
      showsBuildings={false}
      moveOnMarkerPress={false}
      onPress={() => {
        if (tappingMarker.current) {
          tappingMarker.current = false;
          return;
        }
        if (canMove) onSelectPin(null);
      }}
    >
      {pins.map((pin) => {
        const selected = pin.id === selectedId;
        return (
          <Marker
            key={`${pin.id}-${selected ? 'on' : 'off'}`}
            coordinate={{ latitude: pin.lat, longitude: pin.lng }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
            stopPropagation
            onPress={() => {
              tappingMarker.current = true;
              if (canMove) onSelectPin(pin.id);
            }}
          >
            <EventMapPin selected={selected} count={pin.events.length} />
          </Marker>
        );
      })}
    </MapView>
  );
}
