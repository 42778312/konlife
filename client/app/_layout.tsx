import 'react-native-gesture-handler';
import { DarkTheme, ThemeProvider, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { EventExpandProvider } from '@/context/EventExpandProvider';
import { EventsProvider } from '@/context/EventsProvider';
import { SavedEventsProvider } from '@/context/SavedEventsProvider';
import { colors } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.card,
    border: colors.rule,
    primary: colors.highlighter,
    text: colors.fg,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <ThemeProvider value={AppTheme}>
          <EventsProvider>
            <SavedEventsProvider>
              <EventExpandProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.bg },
                    animation: 'fade',
                  }}
                >
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="e/[code]"
                    options={{
                      headerShown: false,
                      presentation: 'transparentModal',
                      animation: 'none',
                      contentStyle: { backgroundColor: 'transparent' },
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="event/[id]"
                    options={{
                      headerShown: false,
                      animation: 'none',
                      contentStyle: { backgroundColor: colors.bg },
                    }}
                  />
                </Stack>
                <StatusBar style="light" />
              </EventExpandProvider>
            </SavedEventsProvider>
          </EventsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
