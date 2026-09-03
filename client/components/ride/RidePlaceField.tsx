import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { LocateFixed, X } from 'lucide-react-native';
import { colors, fonts, MIN_TOUCH, radius } from '@/constants/theme';
import { IconButton } from '@/components/ui/IconButton';

type RidePlaceFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  accessibilityLabel: string;
  kind: 'origin' | 'destination';
  onFocus?: () => void;
  locateLabel?: string;
  onLocate?: () => void;
};

export function RidePlaceField({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  kind,
  onFocus,
  locateLabel,
  onLocate,
}: RidePlaceFieldProps) {
  const showLocate = Boolean(onLocate);
  return (
    <View style={styles.wrap}>
      <View style={styles.dotHit} pointerEvents="none">
        <View style={[styles.dot, kind === 'origin' ? styles.dotOrigin : styles.dotEnd]} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[styles.input, showLocate || value.length > 0 ? styles.inputTrail : null]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        keyboardType="default"
        underlineColorAndroid="transparent"
        selectionColor={colors.highlighter}
        accessibilityLabel={accessibilityLabel}
        {...({ inputMode: 'search' } as object)}
      />
      {value.length > 0 ? (
        <View style={styles.clear}>
          <IconButton
            icon={X}
            size={16}
            color={colors.muted}
            accessibilityLabel={`Clear ${accessibilityLabel}`}
            onPress={() => onChangeText('')}
          />
        </View>
      ) : showLocate ? (
        <View style={styles.clear}>
          <IconButton
            icon={LocateFixed}
            size={18}
            color={colors.highlighter}
            accessibilityLabel={locateLabel ?? 'Use current location'}
            onPress={onLocate}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', justifyContent: 'center' },
  dotHit: {
    position: 'absolute',
    left: 0,
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOrigin: { backgroundColor: colors.highlighter },
  dotEnd: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.rule,
  },
  input: {
    width: '100%',
    minHeight: 48,
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12,
    color: colors.fg,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
  },
  inputTrail: { paddingRight: 48 },
  clear: { position: 'absolute', right: 4 },
});
