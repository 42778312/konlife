import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { colors, space, type } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { IconButton } from '@/components/ui/IconButton';

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
      <IconButton
        icon={Search}
        accessibilityLabel="Search"
        color={colors.subtle}
        onPress={() => {
          selectionTick();
          onSearchPress?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingBottom: 8,
    backgroundColor: colors.bg,
  },
  logo: {
    ...type.display,
    color: colors.neon,
    letterSpacing: 1.6,
  },
});
