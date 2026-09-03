import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark, Download } from 'lucide-react-native';
import { fonts, webCursor } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { IconButton } from '@/components/ui/IconButton';
import { useIosInstall } from '@/components/pwa/IosInstallProvider';
import { CHROME, home } from '@/components/home/tokens';

export function HomeHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { desktop } = useBreakpoint();
  const { eligible, open } = useIosInstall();
  const padTop = desktop ? 0 : Math.max(insets.top, 0);

  return (
    <View style={[styles.row, { paddingTop: padTop }]}>
      <View style={[styles.side, eligible && styles.sideWide]}>
        <View style={styles.mark} accessibilityLabel="KonVita">
          <Image source={require('@/assets/images/icon.png')} style={styles.markImage} />
        </View>
      </View>
      <View style={styles.greet}>
        <Text style={styles.welcome}>Welcome back</Text>
        <Text style={styles.city} accessibilityRole="header">
          Konstanz
        </Text>
      </View>
      <View style={[styles.side, styles.sideEnd, eligible && styles.sideWide]}>
        {eligible ? (
          <IconButton
            icon={Download}
            variant="circle"
            color={home.lime}
            size={20}
            accessibilityLabel="Install on iPhone"
            onPress={open}
            style={styles.chrome}
          />
        ) : null}
        <IconButton
          icon={Bookmark}
          variant="circle"
          color={home.lime}
          size={20}
          accessibilityLabel="Saved nights"
          onPress={() => router.push('/saved')}
          style={styles.chrome}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 4,
  },
  side: {
    width: CHROME,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sideWide: {
    width: CHROME * 2 + 8,
  },
  sideEnd: {
    justifyContent: 'flex-end',
  },
  mark: {
    width: CHROME,
    height: CHROME,
    borderRadius: 999,
    backgroundColor: home.circle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markImage: {
    width: CHROME,
    height: CHROME,
  },
  greet: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  welcome: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: home.muted,
  },
  city: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: '#FFFFFF',
  },
  chrome: {
    width: CHROME,
    height: CHROME,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: home.circle,
    ...webCursor,
  },
});
