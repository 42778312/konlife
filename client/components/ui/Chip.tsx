import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, MIN_TOUCH, radius, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';

type IconProps = { size: number; color: string; strokeWidth: number };

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: React.ComponentType<IconProps>;
  iconPosition?: 'start' | 'end';
  accessibilityLabel?: string;
};

export function Chip({
  label,
  selected = false,
  onPress,
  icon: Icon,
  iconPosition = 'start',
  accessibilityLabel,
}: ChipProps) {
  const iconColor = selected ? colors.accentFg : colors.subtle;
  const icon = Icon ? <Icon size={14} color={iconColor} strokeWidth={2.2} /> : null;

  return (
    <Pressable
      onPress={() => {
        selectionTick();
        onPress();
      }}
      style={[styles.chip, selected ? styles.selected : styles.idle, webCursor]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {iconPosition === 'start' ? icon : null}
      <Text style={[styles.label, selected ? styles.labelOn : styles.labelOff]}>{label}</Text>
      {iconPosition === 'end' ? icon : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: MIN_TOUCH,
    paddingHorizontal: 14,
    borderRadius: radius.full,
  },
  selected: { backgroundColor: colors.highlighter },
  idle: { backgroundColor: colors.card },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  labelOn: { color: colors.accentFg },
  labelOff: { color: colors.fg },
});
