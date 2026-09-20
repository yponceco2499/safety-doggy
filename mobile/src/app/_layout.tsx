import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/lib/auth-context';
import { loadReportTypeDurationOverrides } from '@/lib/report-type-settings';

SplashScreen.preventAutoHideAsync();

// Side-effect import: registers the background walk-tracking task at app
// boot, so Android can wake it up mid-walk even after the JS engine
// restarts. Loaded via require() instead of a static import so a failure to
// register the task is contained (walk distance tracking then falls back to
// unavailable) instead of preventing the whole app from starting.
try {
  require('@/lib/walk-tracking');
} catch (error) {
  console.error('walk-tracking registration failed at boot:', error);
}

// Fire-and-forget: not awaited before first render, see the comment on this
// function for why blocking startup on it isn't worth it.
try {
  loadReportTypeDurationOverrides();
} catch (error) {
  console.error('loadReportTypeDurationOverrides failed synchronously:', error);
}

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
