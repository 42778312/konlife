import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, hitSlop, radius } from '@/constants/theme';
import { DAYS, type DayKey } from '@/data/mockEvents';
import { selectionTick } from '@/lib/haptics';

type DayPillsProps = {
  selected: DayKey;
  onSelect: (day: DayKey) => void;
};

export function DayPills({ selected, onSelect }: DayPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      decelerationRate="fast"
      keyboardShouldPersistTaps="handled"
    >
      {DAYS.map((day) => {
        const active = selected === day;
        return (
          <Pressable
            key={day}
            hitSlop={hitSlop}
            onPress={() => {
              selectionTick();
              onSelect(day);
            }}
            style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
          >
            <Text style={[styles.label, active ? styles.labelActive : styles.labelIdle]}>{day}</Text>
          </Pressable>
        );
      })}
      <View style={{ width: 4 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  pill: {
    minHeight: 36,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  pillActive: {
    backgroundColor: colors.neon,
    boxShadow: '0px 2px 8px rgba(204, 255, 0, 0.25)',
  },
  pillIdle: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  labelActive: {
    color: colors.black,
  },
  labelIdle: {
    color: colors.zinc300,
  },
});
