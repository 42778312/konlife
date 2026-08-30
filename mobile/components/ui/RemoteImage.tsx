import React, { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ImageStyle, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/theme';
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
});
