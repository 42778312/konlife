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
import { colors, radius, space, type, webCursor } from '@/constants/theme';
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
      <View style={[styles.river, { top: compact ? 40 : 90 }]} />
      <View style={[styles.roadV, { left: '18%' }]} />
      <View style={[styles.roadV, { left: '42%' }]} />
      <View style={[styles.roadV, { left: '68%' }]} />
      <View style={[styles.roadH, { top: compact ? 70 : 160 }]} />

      {!compact ? (
        <View style={[styles.pinWrap, { top: '28%', left: '22%' }]}>
          <MapPin size={22} color={colors.ink} fill={colors.highlighter} strokeWidth={2} />
          <View style={styles.pinLabel}>
            <Text style={styles.pinLabelText}>Döbele</Text>
          </View>
        </View>
      ) : null}

      <Animated.View style={[styles.pinWrap, styles.pinCenter, pinStyle]}>
        <MapPin size={compact ? 22 : 28} color={colors.ink} fill={colors.highlighter} strokeWidth={2} />
        <View style={styles.cityLabel}>
          <Text style={styles.cityLabelText}>{cityName}</Text>
        </View>
      </Animated.View>

      {!compact ? (
        <View style={[styles.pinWrap, { bottom: '22%', right: '28%' }]}>
          <MapPin size={20} color={colors.ink} fill={colors.highlighter} strokeWidth={2} />
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
          <View style={styles.venueCopy}>
            <Text style={styles.venueName}>{venueName}</Text>
            <Text style={styles.venueMeta}>Popular · 3 upcoming events</Text>
            <Pressable style={[styles.venueLink, webCursor]} accessibilityRole="button" accessibilityLabel="View venue">
              <Text style={styles.venueLinkText}>View venue</Text>
              <ChevronRight size={14} color={colors.ink} strokeWidth={2.5} />
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
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  compact: {
    height: '100%',
    borderRadius: radius.md,
  },
  river: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(27, 29, 31, 0.12)',
    transform: [{ rotate: '-4deg' }],
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(27, 29, 31, 0.2)',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(27, 29, 31, 0.2)',
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
    backgroundColor: colors.overlay,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  pinLabelText: {
    ...type.overline,
    letterSpacing: 0.4,
    textTransform: 'none',
    color: colors.paper,
  },
  cityLabel: {
    marginTop: 4,
    backgroundColor: colors.overlay,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  cityLabelText: {
    ...type.label,
    color: colors.paper,
  },
  venueCard: {
    position: 'absolute',
    right: space.lg,
    bottom: space.lg,
    left: space.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  venueThumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
  },
  venueCopy: {
    flex: 1,
    minWidth: 0,
  },
  venueName: {
    ...type.title,
    fontSize: 15,
    lineHeight: 20,
  },
  venueMeta: {
    ...type.meta,
    marginTop: 2,
  },
  venueLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
    minHeight: 44,
  },
  venueLinkText: {
    ...type.label,
    color: colors.ink,
  },
});
