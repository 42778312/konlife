import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Check, ChevronDown } from 'lucide-react-native';
import { DAYS, type DayKey } from '@/data/mockEvents';
import { colors, fonts, MIN_TOUCH, radius, space, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import {
  dayFilterLabel,
  isAllVenues,
  priceFilterLabel,
  toggleVenue,
  venueFilterLabel,
  type FilterDim,
  type PriceFilter,
} from '@/lib/exploreFilters';

type ExploreFiltersProps = {
  day: DayKey | 'All';
  onDayChange: (day: DayKey | 'All') => void;
  venues: string[];
  selectedVenues: string[];
  onVenuesChange: (venues: string[]) => void;
  price: PriceFilter;
  onPriceChange: (price: PriceFilter) => void;
};

const PRICE_OPTIONS: { id: PriceFilter; label: string }[] = [
  { id: 'all', label: 'Any price' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
];

export function ExploreFilters({
  day,
  onDayChange,
  venues,
  selectedVenues,
  onVenuesChange,
  price,
  onPriceChange,
}: ExploreFiltersProps) {
  const { desktop } = useBreakpoint();
  const rootRef = useRef<View>(null);
  const [open, setOpen] = useState<FilterDim | null>(null);

  const whenOn = day !== 'All';
  const whereOn = !isAllVenues(selectedVenues, venues);
  const priceOn = price !== 'all';
  const allVenues = isAllVenues(selectedVenues, venues);

  useEffect(() => {
    if (open == null || typeof document === 'undefined') return;

    let armed = false;
    const arm = requestAnimationFrame(() => {
      armed = true;
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    const onPointer = (event: Event) => {
      if (!armed) return;
      const target = event.target;
      if (!(target instanceof Node)) {
        setOpen(null);
        return;
      }
      const node = rootRef.current as unknown as { contains?: (other: Node) => boolean } | null;
      if (node && typeof node.contains === 'function' && node.contains(target)) return;
      if (target instanceof Element && target.closest('#explore-filters')) return;
      setOpen(null);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      cancelAnimationFrame(arm);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const toggleDim = (dim: FilterDim) => {
    selectionTick();
    setOpen((current) => (current === dim ? null : dim));
  };

  return (
    <View ref={rootRef} collapsable={false} nativeID="explore-filters" style={[styles.root, desktop && styles.cluster]}>
      <View style={styles.pills}>
        <FilterPill
          label={dayFilterLabel(day)}
          active={whenOn}
          expanded={open === 'when'}
          fill={desktop}
          accessibilityLabel={whenOn ? `When, ${day}` : 'When, any day'}
          onPress={() => toggleDim('when')}
        />
        <FilterPill
          label={venueFilterLabel(selectedVenues, venues)}
          active={whereOn}
          expanded={open === 'where'}
          fill={desktop}
          shrink
          accessibilityLabel={
            whereOn ? `Where, ${venueFilterLabel(selectedVenues, venues)}` : 'Where, all venues'
          }
          onPress={() => toggleDim('where')}
        />
        <FilterPill
          label={priceFilterLabel(price)}
          active={priceOn}
          expanded={open === 'price'}
          fill={desktop}
          accessibilityLabel={priceOn ? `Price, ${priceFilterLabel(price)}` : 'Price, any price'}
          onPress={() => toggleDim('price')}
        />
      </View>

      {open ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
          style={styles.menu}
          accessibilityRole="menu"
        >
          {open === 'when' ? (
            <OptionRow
              label="Any day"
              selected={day === 'All'}
              onPress={() => {
                onDayChange('All');
                setOpen(null);
              }}
            />
          ) : null}
          {open === 'when'
            ? DAYS.map((item) => (
                <OptionRow
                  key={item}
                  label={item}
                  selected={day === item}
                  onPress={() => {
                    onDayChange(item);
                    setOpen(null);
                  }}
                />
              ))
            : null}

          {open === 'where' ? (
            <ScrollView
              style={styles.venueScroll}
              contentContainerStyle={styles.venueList}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
            >
              <OptionRow
                label="All venues"
                selected={allVenues}
                onPress={() => onVenuesChange([])}
              />
              {venues.length === 0 ? (
                <Text style={styles.empty}>Venues show up once nights load.</Text>
              ) : (
                venues.map((name) => (
                  <OptionRow
                    key={name}
                    label={name}
                    selected={!allVenues && selectedVenues.includes(name)}
                    onPress={() => onVenuesChange(toggleVenue(name, selectedVenues, venues))}
                  />
                ))
              )}
            </ScrollView>
          ) : null}

          {open === 'price'
            ? PRICE_OPTIONS.map((item) => (
                <OptionRow
                  key={item.id}
                  label={item.label}
                  selected={price === item.id}
                  onPress={() => {
                    onPriceChange(item.id);
                    setOpen(null);
                  }}
                />
              ))
            : null}
        </Animated.View>
      ) : null}
    </View>
  );
}

type FilterPillProps = {
  label: string;
  active: boolean;
  expanded: boolean;
  fill: boolean;
  shrink?: boolean;
  accessibilityLabel: string;
  onPress: () => void;
};

function FilterPill({ label, active, expanded, fill, shrink, accessibilityLabel, onPress }: FilterPillProps) {
  const on = active || expanded;
  const ink = on ? colors.accentFg : colors.fg;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.pill,
        fill ? styles.pillFill : styles.pillHug,
        shrink && !fill ? styles.pillShrink : null,
        on ? styles.pillOn : styles.pillOff,
        (hovered || pressed) && !on ? styles.pillHover : null,
        webCursor,
      ]}
      accessibilityRole="button"
      accessibilityState={{ expanded, selected: active }}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={[styles.pillLabel, { color: ink }]} numberOfLines={1}>
        {label}
      </Text>
      <View style={[styles.chevron, expanded && styles.chevronOpen]}>
        <ChevronDown size={16} color={ink} strokeWidth={2.2} />
      </View>
    </Pressable>
  );
}

type OptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function OptionRow({ label, selected, onPress }: OptionRowProps) {
  return (
    <Pressable
      onPress={() => {
        selectionTick();
        onPress();
      }}
      style={({ pressed, hovered }) => [
        styles.option,
        (hovered || pressed) && styles.optionHover,
        webCursor,
      ]}
      accessibilityRole="menuitem"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <View style={[styles.mark, selected ? styles.markOn : styles.markOff]}>
        {selected ? <Check size={12} color={colors.accentFg} strokeWidth={2.8} /> : null}
      </View>
      <Text style={styles.optionLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { gap: space.sm, zIndex: 2 },
  cluster: { alignSelf: 'flex-start', width: 420, maxWidth: '100%' },
  pills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: MIN_TOUCH,
    paddingHorizontal: 12,
    borderRadius: radius.full,
  },
  pillFill: { flex: 1, minWidth: 0 },
  pillHug: { flexGrow: 0, flexShrink: 0 },
  pillShrink: { flexShrink: 1, minWidth: 96, maxWidth: 200 },
  pillOn: { backgroundColor: colors.highlighter },
  pillOff: { backgroundColor: colors.card },
  pillHover: { backgroundColor: colors.circle },
  pillLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    flexShrink: 1,
  },
  chevron: { flexShrink: 0 },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  menu: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
    padding: 6,
    gap: 2,
  },
  venueScroll: { maxHeight: 320 },
  venueList: { gap: 2 },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: MIN_TOUCH,
    paddingHorizontal: 10,
    borderRadius: radius.full,
  },
  optionHover: { backgroundColor: colors.circle },
  mark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markOff: { backgroundColor: colors.circle },
  markOn: { backgroundColor: colors.highlighter },
  optionLabel: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.fg,
  },
});
