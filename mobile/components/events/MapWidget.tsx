import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { colors, fonts, radius } from '@/constants/theme';
import { RemoteImage } from '@/components/ui/RemoteImage';

type MapWidgetProps = {
  venueName?: string;
  cityName?: string;
  interactive?: boolean;
  compact?: boolean;
};

export function MapWidget({
  venueName = 'Blechnerei',
  cityName = 'Konstanz',
  interactive = true,
  compact = false,
}: MapWidgetProps) {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [bounce]);

  const pinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <View style={[styles.canvas, compact && styles.compact]}>
      <View style={styles.grid} />
      <View style={[styles.river, { top: compact ? 40 : 90 }]} />
      <View style={[styles.roadV, { left: '18%' }]} />
      <View style={[styles.roadV, { left: '42%' }]} />
      <View style={[styles.roadV, { left: '68%' }]} />
      <View style={[styles.roadH, { top: compact ? 70 : 160 }]} />

      {!compact ? (
        <View style={[styles.pinWrap, { top: '28%', left: '22%' }]}>
          <MapPin size={22} color={colors.neon} fill="rgba(204,255,0,0.3)" strokeWidth={2} />
          <View style={styles.pinLabel}>
            <Text style={styles.pinLabelText}>Döbele</Text>
          </View>
        </View>
      ) : null}

      <Animated.View style={[styles.pinWrap, styles.pinCenter, pinStyle]}>
        <MapPin size={compact ? 22 : 28} color={colors.neon} fill={colors.neon} strokeWidth={2} />
        <View style={styles.cityLabel}>
          <Text style={styles.cityLabelText}>{cityName}</Text>
        </View>
      </Animated.View>

      {!compact ? (
        <View style={[styles.pinWrap, { bottom: '22%', right: '28%' }]}>
          <MapPin size={20} color={colors.neon} fill="rgba(204,255,0,0.3)" strokeWidth={2} />
          <View style={styles.pinLabel}>
            <Text style={styles.pinLabelText}>Petershausen</Text>
          </View>
        </View>
      ) : null}

      {interactive && !compact ? (
        <View style={styles.venueCard}>
          <RemoteImage
            uri="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=150&q=80"
            alt={venueName}
            containerStyle={styles.venueThumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.venueName}>{venueName}</Text>
            <Text style={styles.venueMeta}>Popular · 3 upcoming events</Text>
            <Pressable style={styles.venueLink}>
              <Text style={styles.venueLinkText}>View venue</Text>
              <ChevronRight size={14} color={colors.neon} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    height: 260,
    borderRadius: radius['3xl'],
    overflow: 'hidden',
    backgroundColor: '#0e0e11',
    borderWidth: 1,
    borderColor: colors.zinc800,
  },
  compact: {
    height: '100%',
    borderRadius: 12,
  },
  grid: {
    ...StyleSheet.absoluteFill,
    opacity: 0.8,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  river: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(63, 63, 70, 0.45)',
    transform: [{ rotate: '-4deg' }],
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(39, 39, 42, 0.85)',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(39, 39, 42, 0.85)',
  },
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinCenter: {
    top: '42%',
    left: '50%',
    marginLeft: -20,
  },
  pinLabel: {
    marginTop: 2,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.zinc800,
  },
  pinLabelText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.zinc400,
  },
  cityLabel: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.5)',
  },
  cityLabelText: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.white,
    letterSpacing: 0.4,
  },
  venueCard: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(20, 20, 23, 0.95)',
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: radius['2xl'],
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  venueThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  venueName: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  venueMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.zinc400,
    marginTop: 2,
  },
  venueLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
    minHeight: 28,
    cursor: 'pointer',
  },
  venueLinkText: {
    fontFamily: fonts.extrabold,
    fontSize: 12,
    color: colors.neon,
  },
});
