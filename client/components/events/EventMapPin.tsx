import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors, fonts, radius } from '@/constants/theme';

type EventMapPinProps = {
  selected?: boolean;
  count?: number;
};

export function EventMapPin({ selected = false, count = 1 }: EventMapPinProps) {
  const size = selected ? 28 : 22;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={[styles.glyph, selected && styles.glyphOn]}>
        <MapPin size={size} color={colors.accentFg} fill={colors.highlighter} strokeWidth={2} />
      </View>
      {count > 1 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : String(count)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 36,
    minHeight: 36,
  },
  glyph: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphOn: {
    transform: [{ scale: 1.08 }],
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.highlighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.highlighter,
  },
});
