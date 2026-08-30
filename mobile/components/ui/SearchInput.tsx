import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, fonts, hitSlop, radius } from '@/constants/theme';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search events, clubs and bars...',
  autoFocus,
}: SearchInputProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Search size={18} color={colors.zinc400} strokeWidth={2} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.zinc500}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="search"
        keyboardType="default"
        underlineColorAndroid="transparent"
        selectionColor={colors.neon}
        // 16px prevents iOS Safari from zooming the viewport on focus
        {...({ inputMode: 'search' } as object)}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={hitSlop}
          style={styles.clear}
          accessibilityLabel="Clear search"
        >
          <X size={16} color={colors.zinc400} strokeWidth={2.2} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    minHeight: 48,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: radius['2xl'],
    paddingLeft: 42,
    paddingRight: 42,
    paddingVertical: 12,
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
  },
  clear: {
    position: 'absolute',
    right: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
});
