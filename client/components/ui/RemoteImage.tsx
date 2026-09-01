import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ImageStyle, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, fonts } from '@/constants/theme';
import { Skeleton } from '@/components/ui/Skeleton';

type RemoteImageProps = {
  uri: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentFit?: 'cover' | 'contain';
  alt?: string;
};

export function RemoteImage({
  uri,
  style,
  containerStyle,
  contentFit = 'cover',
  alt,
}: RemoteImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const mark = (alt ?? '').trim().charAt(0).toUpperCase() || 'K';

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    if (!uri) return;
    const timer = setTimeout(() => setLoaded(true), 2800);
    return () => clearTimeout(timer);
  }, [uri]);

  if (!uri || failed) {
    return (
      <View style={[styles.wrap, styles.fallback, containerStyle]}>
        <Text style={styles.mark}>{mark}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, containerStyle]}>
      {!loaded ? <Skeleton style={StyleSheet.absoluteFill} /> : null}
      <Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, style]}
        contentFit={contentFit}
        transition={220}
        accessibilityLabel={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        cachePolicy="memory-disk"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.zinc900,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
  },
  mark: {
    fontFamily: fonts.displayBlack,
    fontSize: 28,
    color: colors.highlighter,
  },
});
