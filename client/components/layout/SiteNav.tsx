import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, MIN_TOUCH, space, type, webCursor } from '@/constants/theme';
import { selectionTick } from '@/lib/haptics';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const LINKS = [
  { href: '/', label: 'Discover', match: (p: string) => p === '/' || p === '/index' },
  { href: '/discover', label: 'Explore', match: (p: string) => p.startsWith('/discover') },
  { href: '/weekend', label: 'Weekend', match: (p: string) => p.startsWith('/weekend') },
  { href: '/ride', label: 'Ride', match: (p: string) => p.startsWith('/ride') },
  { href: '/saved', label: 'Saved', match: (p: string) => p.startsWith('/saved') },
] as const;

export function SiteNav() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const { desktop } = useBreakpoint();
  const homePhone = !desktop && (pathname === '/' || pathname === '/index');
  if (homePhone) return null;

  return (
    <View style={[styles.bar, { paddingTop: Math.max(insets.top, 8) }]}>
      <Pressable
        onPress={() => router.push('/')}
        accessibilityRole="link"
        accessibilityLabel="KonVita home"
        style={[styles.brandHit, webCursor]}
      >
        <Text style={type.wordmark}>KonVita</Text>
      </Pressable>
      {desktop ? (
        <View style={styles.links}>
          {LINKS.map((link) => {
            const active = link.match(pathname);
            return (
              <Pressable
                key={link.href}
                onPress={() => {
                  selectionTick();
                  router.push(link.href);
                }}
                style={[styles.link, webCursor]}
                accessibilityRole="link"
                accessibilityState={{ selected: active }}
                accessibilityLabel={link.label}
              >
                <Text style={[styles.linkText, active && styles.linkActive]}>{link.label}</Text>
                {active ? <View style={styles.underline} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.xl,
    paddingBottom: 8,
    backgroundColor: colors.paperNav,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.rule,
  },
  brandHit: {
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  linkText: {
    ...type.nav,
  },
  linkActive: {
    fontFamily: fonts.bold,
  },
  underline: {
    height: 1,
    backgroundColor: colors.highlighter,
    marginTop: 2,
  },
});
