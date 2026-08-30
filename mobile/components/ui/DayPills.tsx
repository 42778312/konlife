import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DAYS, type DayKey } from '@/data/mockEvents';
import { Chip } from '@/components/ui/Chip';

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
      {DAYS.map((day) => (
        <Chip key={day} label={day} selected={selected === day} onPress={() => onSelect(day)} />
      ))}
      <View style={styles.tail} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tail: {
    width: 4,
  },
});
