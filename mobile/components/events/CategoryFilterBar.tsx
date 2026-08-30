import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Building2, Globe, GraduationCap, Music, PartyPopper, Utensils } from 'lucide-react-native';
import { CATEGORIES } from '@/data/mockEvents';
import { colors, fonts, hitSlop, radius } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';

type CategoryFilterBarProps = {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
};

const ICON_MAP = {
  GraduationCap,
  PartyPopper,
  Building2,
  Utensils,
  Music,
  Globe,
};

export function CategoryFilterBar({ activeCategory, onSelectCategory }: CategoryFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      decelerationRate="fast"
      keyboardShouldPersistTaps="handled"
    >
      {CATEGORIES.map((cat) => {
        const Icon = ICON_MAP[cat.icon] ?? Globe;
        const isActive = activeCategory === cat.id;
        return (
          <Pressable
            key={cat.id}
            hitSlop={hitSlop}
            onPress={() => {
              selectionTick();
              onSelectCategory(cat.id);
            }}
            style={[styles.pill, isActive ? styles.pillActive : styles.pillIdle]}
          >
            <Icon size={14} color={isActive ? colors.black : colors.zinc300} strokeWidth={2.2} />
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelIdle]}>
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
    paddingVertical: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    cursor: 'pointer',
  },
  pillActive: {
    backgroundColor: colors.neon,
    borderColor: colors.neon,
    boxShadow: '0px 2px 10px rgba(204, 255, 0, 0.25)',
  },
  pillIdle: {
    backgroundColor: colors.card,
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
