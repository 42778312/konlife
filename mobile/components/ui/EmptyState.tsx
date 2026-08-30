import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space, type } from '@/constants/theme';

type IconProps = { size: number; color: string; strokeWidth: number };

type EmptyStateProps = {
  icon: React.ComponentType<IconProps>;
  title: string;
  message?: string;
};

export function EmptyState({ icon: Icon, title, message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Icon size={22} color={colors.highlighter} strokeWidth={2} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-start', paddingVertical: space['2xl'], gap: 10 },
  title: { ...type.title },
  message: { ...type.meta, maxWidth: 360 },
});
