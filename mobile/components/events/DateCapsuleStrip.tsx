import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { dayNumber, weekdayLabel } from '@/lib/partyInsider/dates';
import { selectionTick } from '@/lib/haptics';
import { colors, fonts, MIN_TOUCH, webCursor } from '@/constants/theme';

const CAPSULE_W = 54;
const GAP = 10;

type DateCapsuleStripProps = {
  days: string[];
  selectedYmd: string;
  onSelect: (ymd: string) => void;
};

export function DateCapsuleStrip({ days, selectedYmd, onSelect }: DateCapsuleStripProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = days.indexOf(selectedYmd);
    if (index < 0) return;
    const x = Math.max(0, index * (CAPSULE_W + GAP) - CAPSULE_W);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x, animated: true });
    });
  }, [days, selectedYmd]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      decelerationRate="fast"
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >
      {days.map((ymd) => {
        const selected = ymd === selectedYmd;
        const weekday = weekdayLabel(ymd);
        return (
          <Pressable
            key={ymd}
            onPress={() => {
              selectionTick();
              onSelect(ymd);
            }}
            style={[styles.capsule, selected ? styles.capsuleOn : styles.capsuleOff, webCursor]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${dayNumber(ymd)} ${weekday}`}
          >
            <Text style={[styles.num, selected && styles.onInk]}>{dayNumber(ymd)}</Text>
            <Text style={[styles.day, selected && styles.onInk]}>{weekday}</Text>
          </Pressable>
        );
      })}
      <View style={styles.tail} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP,
    paddingRight: 8,
  },
  capsule: {
    width: CAPSULE_W,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: MIN_TOUCH,
  },
  capsuleOn: {
    backgroundColor: colors.highlighter,
  },
  capsuleOff: {
    backgroundColor: colors.cardAlt,
  },
  num: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    color: colors.fg,
    fontVariant: ['tabular-nums'],
  },
  day: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  onInk: {
    color: colors.accentFg,
  },
  tail: { width: 4 },
});
