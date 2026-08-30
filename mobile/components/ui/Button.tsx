import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, MIN_TOUCH, radius, type } from '@/constants/theme';
import { PressableScale } from '@/components/ui/PressableScale';

type IconProps = { size: number; color: string; strokeWidth: number; fill?: string };

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ComponentType<IconProps>;
  iconFill?: string;
  flex?: boolean;
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon: Icon,
  iconFill = 'transparent',
  flex = false,
  accessibilityLabel,
}: ButtonProps) {
  const onAccent = variant === 'primary';
  const iconColor = onAccent ? colors.accentFg : colors.fg;

  return (
    <PressableScale
      onPress={onPress}
      style={[styles.hit, flex && styles.flex]}
      contentStyle={[styles.base, onAccent ? styles.primary : styles.secondary]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {Icon ? <Icon size={16} color={iconColor} strokeWidth={2.2} fill={iconFill} /> : null}
      <Text style={[type.button, onAccent ? styles.labelPrimary : styles.labelSecondary]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hit: { minHeight: MIN_TOUCH },
  flex: { flex: 1 },
  base: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primary: { backgroundColor: colors.highlighter },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  labelPrimary: { color: colors.accentFg },
  labelSecondary: { color: colors.fg },
});
