import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fonts, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { home } from '@/components/home/tokens';

export type CategoryThumb = {
  id: string;
  label: string;
  image: string;
};

type CategoryPillsProps = {
  categories: CategoryThumb[];
  selected: string;
  onSelect: (id: string) => void;
};

export function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      decelerationRate="fast"
      nestedScrollEnabled
    >
      {categories.map((cat) => {
        const on = cat.id === selected;
        return (
          <Pressable
            key={cat.id}
            onPress={() => {
              selectionTick();
              onSelect(cat.id);
            }}
            style={[styles.pill, on ? styles.pillOn : styles.pillOff, webCursor]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={cat.label}
          >
            <RemoteImage uri={cat.image} alt="" containerStyle={styles.thumb} />
            <Text style={[styles.label, on ? styles.labelOn : styles.labelOff]} numberOfLines={1}>
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 40,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: 999,
  },
  pillOn: { backgroundColor: home.lime },
  pillOff: { backgroundColor: home.plate },
  thumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
  },
  labelOn: { color: home.ink },
  labelOff: { color: '#FFFFFF' },
});
