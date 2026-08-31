import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, webCursor } from '@/constants/theme';
import { home } from '@/components/home/tokens';

type HomeSectionRowProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function HomeSectionRow({ title, actionLabel, onAction }: HomeSectionRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={12}
          style={[styles.action, webCursor]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#FFFFFF',
  },
  action: {
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  actionText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: home.muted,
  },
});
