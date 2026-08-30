import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, fonts, radius } from '@/constants/theme';
import { IconButton } from '@/components/ui/IconButton';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  variant?: 'sheet' | 'pill';
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search nights, venues, genres',
  autoFocus,
  variant = 'pill',
}: SearchInputProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon} pointerEvents="none">
        <Search size={18} color={colors.muted} strokeWidth={2} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[styles.input, variant === 'sheet' ? styles.sheet : styles.pill]}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="search"
        keyboardType="default"
        underlineColorAndroid="transparent"
        selectionColor={colors.highlighter}
        accessibilityLabel="Search nights"
        {...({ inputMode: 'search' } as object)}
      />
      {value.length > 0 ? (
        <View style={styles.clear}>
          <IconButton
            icon={X}
            size={16}
            color={colors.muted}
            accessibilityLabel="Clear search"
            onPress={() => onChangeText('')}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', justifyContent: 'center' },
  icon: { position: 'absolute', left: 16, zIndex: 1 },
  input: {
    width: '100%',
    minHeight: 48,
    paddingLeft: 44,
    paddingRight: 48,
    paddingVertical: 12,
    color: colors.fg,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
  },
  pill: {
    backgroundColor: colors.card,
    borderRadius: radius.full,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  clear: { position: 'absolute', right: 4 },
});
