import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';

type RidePinProps = {
  kind: 'origin' | 'destination';
};

export function RidePin({ kind }: RidePinProps) {
  const fill = kind === 'origin' ? colors.highlighter : colors.white;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={[styles.dot, { backgroundColor: fill }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.bg,
  },
});
