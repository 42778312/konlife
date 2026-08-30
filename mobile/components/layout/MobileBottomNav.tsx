import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark, Calendar, Compass, Home } from 'lucide-react-native';
import { colors, fonts } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';

const ICONS = {
  index: Home,
  discover: Compass,
  weekend: Calendar,
  saved: Bookmark,
} as const;

const LABELS = {
  index: 'Home',
  discover: 'Discover',
  weekend: 'Weekend',
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
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
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
              style={[styles.item, isActive ? styles.itemActive : styles.itemIdle]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={label}
            >
              <Icon
                size={20}
                color={isActive ? colors.black : colors.zinc400}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <Text style={[styles.label, isActive ? styles.labelActive : styles.labelIdle]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(8, 8, 9, 0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(39, 39, 42, 0.85)',
    paddingTop: 8,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    minHeight: 44,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  itemActive: {
    backgroundColor: colors.neon,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 2,
  },
  itemIdle: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 4,
  },
  label: {
    fontSize: 11,
  },
  labelActive: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    color: colors.black,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  labelIdle: {
    fontFamily: fonts.medium,
    color: colors.zinc400,
  },
});
