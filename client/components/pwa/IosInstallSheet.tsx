import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, paperShadow, radius, space, type } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

const GUIDE = require('@/assets/images/ios-install.png');
const PHOTO_RATIO = 391 / 800;
const GUIDE_LABEL = 'Tap Add to Home Screen in the iPhone share sheet';

type IosInstallSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function IosInstallSheet({ visible, onClose }: IosInstallSheetProps) {
  const insets = useSafeAreaInsets();
  const { width: winW, height: winH } = useWindowDimensions();
  const [shown, setShown] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const plateInner = Math.min(winW - space.lg * 2, 480) - space.xl * 2;
  const maxH = Math.min(520, Math.round(winH * 0.52));
  const heightFromWidth = plateInner / PHOTO_RATIO;
  const photoHeight = Math.round(Math.min(maxH, heightFromWidth));
  const photoWidth = Math.round(photoHeight * PHOTO_RATIO);

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
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close install guide">
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
            Keep KonVita on your iPhone
          </Text>
          <Text style={styles.lead}>Share, then Add to Home Screen. It opens like an app.</Text>
          <View style={[styles.clip, { width: photoWidth, height: photoHeight }]}>
            <Image
              source={GUIDE}
              style={{ width: photoWidth, height: photoHeight }}
              contentFit="cover"
              accessibilityLabel={GUIDE_LABEL}
            />
          </View>
          <Button label="Got it" onPress={onClose} />
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
  lead: { ...type.meta, marginBottom: 4 },
  clip: {
    alignSelf: 'center',
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: 8,
  },
});
