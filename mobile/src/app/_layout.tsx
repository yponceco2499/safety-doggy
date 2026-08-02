import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/lib/auth-context';
import { loadReportTypeDurationOverrides } from '@/lib/report-type-settings';
// Side-effect import: registers the background walk-tracking task at app
// boot, so Android can wake it up mid-walk even after the JS engine restarts.
import '@/lib/walk-tracking';

SplashScreen.preventAutoHideAsync();

// Fire-and-forget: not awaited before first render, see the comment on this
// function for why blocking startup on it isn't worth it.
loadReportTypeDurationOverrides();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
