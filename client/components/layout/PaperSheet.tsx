import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, layout, paperShadow, space } from '@/constants/theme';

type PaperSheetProps = {
  children: React.ReactNode;
  clip?: boolean;
};

export function PaperSheet({ children, clip = true }: PaperSheetProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.sheet, paperShadow]}>
        {clip ? (
          <View style={styles.clipWrap} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={styles.clipArm} />
            <View style={styles.clip} />
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: layout.sheetMax,
    alignSelf: 'center',
    paddingHorizontal: space.md,
    paddingBottom: space['3xl'],
  },
  sheet: {
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
    overflow: 'hidden',
  },
  clipWrap: {
    alignItems: 'center',
    height: 18,
    marginBottom: -4,
  },
  clipArm: {
    width: 56,
    height: 10,
    backgroundColor: colors.metal,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  clip: {
    width: 28,
    height: 10,
    marginTop: -2,
    backgroundColor: '#8A8883',
    borderRadius: 1,
  },
});
