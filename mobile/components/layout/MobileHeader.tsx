import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { colors, fonts, hitSlop } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';

type MobileHeaderProps = {
  onSearchPress?: () => void;
};

export function MobileHeader({ onSearchPress }: MobileHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
      <Text style={styles.logo} accessibilityRole="header">
        KONSTANZ
      </Text>
      <Pressable
        onPress={() => {
          selectionTick();
          onSearchPress?.();
        }}
        hitSlop={hitSlop}
        style={styles.searchBtn}
        accessibilityLabel="Search"
      >
        <Search size={20} color={colors.zinc300} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.zinc900,
  },
  logo: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.neon,
    letterSpacing: 1.6,
    lineHeight: 36,
  },
  searchBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
});
