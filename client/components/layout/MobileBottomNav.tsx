import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark, Calendar, Car, Compass, Home } from 'lucide-react-native';
import { colors, fonts, MIN_TOUCH, radius, space, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';

const ICONS = {
  index: Home,
  discover: Compass,
  weekend: Calendar,
  ride: Car,
  saved: Bookmark,
} as const;

const LABELS = {
  index: 'Home',
  discover: 'Explore',
  weekend: 'Weekend',
  ride: 'Ride',
  saved: 'Saved',
} as const;

type TabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
};

export function MobileBottomNav({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const name = route.name as keyof typeof ICONS;
          const Icon = ICONS[name] ?? Home;
          const label = LABELS[name] ?? route.name;

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                selectionTick();
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={[styles.item, isActive && styles.itemActive, webCursor]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={label}
            >
              <Icon
                size={20}
                color={isActive ? colors.accentFg : colors.muted}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <Text style={[styles.label, isActive ? styles.labelActive : styles.labelIdle]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.rule,
    paddingTop: 8,
    paddingHorizontal: space.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  item: {
    minHeight: MIN_TOUCH,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 2,
    paddingVertical: 6,
  },
  itemActive: {
    backgroundColor: colors.highlighter,
    borderRadius: radius.full,
    marginHorizontal: 2,
  },
  label: { fontSize: 11, lineHeight: 14 },
  labelActive: { fontFamily: fonts.bold, color: colors.accentFg },
  labelIdle: { fontFamily: fonts.medium, color: colors.muted },
});
