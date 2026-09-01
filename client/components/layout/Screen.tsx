import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, space } from '@/constants/theme';
import { useWebKeyboardInset } from '@/hooks/useWebKeyboardInset';

type ScreenProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  keyboard?: boolean;
  backgroundColor?: string;
};

export function Screen({
  children,
  header,
  onRefresh,
  refreshing,
  scroll = true,
  contentStyle,
  keyboard = true,
  backgroundColor,
}: ScreenProps) {
  const kbInset = useWebKeyboardInset();
  const field = backgroundColor ?? colors.metal;

  const body = scroll ? (
    <ScrollView
      style={[styles.flex, { backgroundColor: field }]}
      contentContainerStyle={[styles.content, { paddingBottom: space['4xl'] + kbInset }, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      nestedScrollEnabled
      bounces
      overScrollMode="never"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.highlighter}
            colors={[colors.highlighter]}
            progressBackgroundColor={colors.paper}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, { paddingBottom: kbInset }, contentStyle]}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: field }]}
      behavior={keyboard && Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={keyboard && Platform.OS !== 'web'}
    >
      {header}
      {body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.metal,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    flexGrow: 1,
  },
});
