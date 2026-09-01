import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { SiteNav } from '@/components/layout/SiteNav';
import { colors } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function TabLayout() {
  const { desktop } = useBreakpoint();

  return (
    <View style={styles.root}>
      <SiteNav />
      <Tabs
        tabBar={(props) =>
          desktop ? null : (
            <MobileBottomNav
              state={props.state}
              navigation={props.navigation as Parameters<typeof MobileBottomNav>[0]['navigation']}
            />
          )
        }
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          sceneStyle: { backgroundColor: colors.bg },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Discover' }} />
        <Tabs.Screen name="discover" options={{ title: 'Explore' }} />
        <Tabs.Screen name="weekend" options={{ title: 'Weekend' }} />
        <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
