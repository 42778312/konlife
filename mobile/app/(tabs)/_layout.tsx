import React from 'react';
import { Tabs } from 'expo-router';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <MobileBottomNav
          state={props.state}
          navigation={props.navigation as Parameters<typeof MobileBottomNav>[0]['navigation']}
        />
      )}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="weekend" options={{ title: 'Weekend' }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
    </Tabs>
  );
}
