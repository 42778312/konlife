import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Phone } from 'lucide-react-native';
import { colors, fonts, MIN_TOUCH, paperShadow, radius, space, type } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { formatTaxiNumber, TAXI_COMPANIES, type TaxiCompany } from '@/lib/ride/taxi';
import { selectionTick } from '@/lib/haptics';

type RideCallSheetProps = {
  visible: boolean;
  onClose: () => void;
  onPick: (company: TaxiCompany) => void;
};

export function RideCallSheet({ visible, onClose, onPick }: RideCallSheetProps) {
  const insets = useSafeAreaInsets();
  const [shown, setShown] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (visible) {
      setShown(true);
      progress.value = withTiming(1, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }
    progress.value = withTiming(0, {
      duration: 180,
      easing: Easing.in(Easing.cubic),
    });
    const timer = setTimeout(() => setShown(false), 180);
    return () => clearTimeout(timer);
  }, [progress, visible]);

  const dimStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const plateStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * 28 }],
    opacity: 0.35 + progress.value * 0.65,
  }));

  return (
    <Modal visible={shown} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root} accessibilityViewIsModal>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close taxi list">
          <Animated.View style={[styles.dim, dimStyle]} />
        </Pressable>
        <Animated.View
          style={[
            styles.plate,
            paperShadow,
            plateStyle,
            { paddingBottom: Math.max(insets.bottom, 16) + space.md },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title} accessibilityRole="header">
            Who’s free?
          </Text>
          <Text style={styles.lead}>If one’s full, try the next.</Text>
          <View style={styles.list}>
            {TAXI_COMPANIES.map((company) => (
              <PressableScale
                key={company.id}
                onPress={() => {
                  selectionTick();
                  onPick(company);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Call ${company.name} at ${formatTaxiNumber(company.digits)}`}
                contentStyle={styles.row}
              >
                <View style={styles.glyph}>
                  <Phone size={16} color={colors.accentFg} strokeWidth={2.4} />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.name}>{company.name}</Text>
                  <Text style={styles.number}>{formatTaxiNumber(company.digits)}</Text>
                </View>
              </PressableScale>
            ))}
          </View>
          <Button label="Not now" variant="secondary" onPress={onClose} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayHeavy,
  },
  plate: {
    marginHorizontal: space.lg,
    marginBottom: space.sm,
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    gap: space.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.zinc700,
    marginBottom: 8,
  },
  title: { ...type.section, fontSize: 22, lineHeight: 26, marginTop: 4 },
  lead: { ...type.meta, marginBottom: 8 },
  list: { gap: 4, marginBottom: 8 },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    borderRadius: radius.md,
  },
  glyph: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: radius.full,
    backgroundColor: colors.highlighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  name: { ...type.label },
  number: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.subtle,
  },
});
