import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Building2, Globe, GraduationCap, Music, PartyPopper, Utensils } from 'lucide-react-native';
import { CATEGORIES } from '@/data/mockEvents';
import { Chip } from '@/components/ui/Chip';

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
        return (
          <Chip
            key={cat.id}
            label={cat.label}
            icon={Icon}
            selected={activeCategory === cat.id}
            onPress={() => onSelectCategory(cat.id)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
});
