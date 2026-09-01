import React from 'react';
import { Pressable, type PressableProps, type StyleProp, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { MIN_TOUCH, webCursor } from '@/constants/theme';

type PressableScaleProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

const SPRING = { damping: 16, stiffness: 420, mass: 0.4 };

export const PressableScale = React.forwardRef<View, PressableScaleProps>(function PressableScale(
  { children, onPressIn, onPressOut, style, contentStyle, scaleTo = 0.97, ...rest },
  ref,
) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      ref={ref}
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, SPRING);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, SPRING);
        onPressOut?.(e);
      }}
      style={[{ minHeight: MIN_TOUCH }, webCursor, style]}
    >
      <Animated.View style={[animatedStyle, contentStyle]}>{children}</Animated.View>
    </Pressable>
  );
});

PressableScale.displayName = 'PressableScale';

