import React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, hitSlop, MIN_TOUCH, webCursor } from '@/constants/theme';

type IconProps = { size: number; color: string; strokeWidth: number; fill?: string };

type IconButtonProps = {
  icon: React.ComponentType<IconProps>;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: 'ghost' | 'surface';
  color?: string;
  size?: number;
  fill?: string;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  variant = 'ghost',
  color = colors.ink,
  size = 20,
  fill = 'transparent',
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.hit, variant === 'surface' && styles.surface, webCursor, style]}
    >
      <Icon size={size} color={color} strokeWidth={2.2} fill={fill} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: 999,
    backgroundColor: 'rgba(11, 10, 13, 0.55)',
  },
});
